import { Message } from 'discord.js';
import { env } from '../config/env.js';
import { Warn } from '../models/Warn.js';
import { log } from '../utils/logger.js';
import { COLORS } from '../config/constants.js';

// Les séparateurs deviennent des espaces : « con-tent » n'est jamais confondu avec « content ».
const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasWholePhrase = (content: string, phrase: string) => new RegExp(`(^|\\s)${escapeRegex(normalize(phrase))}(?=\\s|$)`, 'i').test(content);

/** Ne sanctionne que des mots ou expressions complets, pour éviter les faux positifs. */
export async function runAutoMod(message: Message) {
  if (!message.guild || message.author.bot || message.member?.permissions.has('ManageMessages')) return;
  const raw = message.content.toLowerCase(); const clean = normalize(raw);
  const forbiddenWord = env.badWords.find(word => hasWholePhrase(clean, word));
  // Les abréviations d'un ou deux caractères ne sont jamais fiables : elles sont ignorées.
  const forbiddenShort = env.badWordsShort.find(word => normalize(word).length >= 3 && hasWholePhrase(clean, word));
  const phishingWord = env.phishingWords.find(word => hasWholePhrase(clean, word));
  const hit = forbiddenWord || forbiddenShort || phishingWord
    || (/discord(?:\.gg|\.com\/invite)\//i.test(raw) ? 'invitation Discord' : null)
    || (/https?:\/\/[^\s]+/i.test(raw) && /(nitro|steam|gift|login|verify)/i.test(raw) ? 'lien suspect' : null);
  if (!hit) return;
  await message.delete().catch(() => null);
  const warnId = `A-${Date.now().toString(36).toUpperCase()}`;
  await Warn.create({ guildId: message.guild.id, userId: message.author.id, moderatorId: message.client.user!.id, reason: `AutoMod: ${hit}`, warnId });
  if (env.automodAction === 'timeout' && message.member?.moderatable) await message.member.timeout(env.automodTimeoutMinutes * 60_000, `AutoMod: ${hit}`).catch(() => null);
  await log(message.client, message.guild, 'AutoMod • Avertissement', `👤 **Membre :** ${message.author}\n⚠️ **Motif :** ${hit}\n🆔 **Warn :** \`${warnId}\`\n🗑️ **Message :** supprimé`, COLORS.warning);
}
