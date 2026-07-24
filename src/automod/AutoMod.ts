import { Message } from 'discord.js';
import { env } from '../config/env.js';
import { Warn } from '../models/Warn.js';
import { log } from '../utils/logger.js';
import { COLORS } from '../config/constants.js';

const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, '');

/** Supprime le contenu dangereux et crée un warn ; aucune exclusion automatique. */
export async function runAutoMod(message: Message) {
  if (!message.guild || message.author.bot || message.member?.permissions.has('ManageMessages')) return;
  const raw = message.content.toLowerCase(); const clean = normalize(raw);
  const listed = [...env.badWords, ...env.badWordsShort, ...env.phishingWords];
  const hit = listed.find(word => clean.includes(normalize(word)))
    || (/discord(?:\.gg|\.com\/invite)\//i.test(raw) ? 'invitation Discord' : null)
    || (/https?:\/\/[^\s]+/i.test(raw) && /(nitro|steam|gift|login|verify)/i.test(raw) ? 'lien suspect' : null);
  if (!hit) return;
  await message.delete().catch(() => null);
  const warnId = `A-${Date.now().toString(36).toUpperCase()}`;
  await Warn.create({ guildId: message.guild.id, userId: message.author.id, moderatorId: message.client.user!.id, reason: `AutoMod: ${hit}`, warnId });
  if (env.automodAction === 'timeout' && message.member?.moderatable) await message.member.timeout(env.automodTimeoutMinutes * 60_000, `AutoMod: ${hit}`).catch(() => null);
  await log(message.client, message.guild, 'AutoMod • Avertissement', `👤 **Membre :** ${message.author}\n⚠️ **Motif :** ${hit}\n🆔 **Warn :** \`${warnId}\`\n🗑️ **Message :** supprimé`, COLORS.warning);
}
