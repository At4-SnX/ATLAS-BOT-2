import { Message } from 'discord.js';
import { Warn } from '../models/Warn.js';
import { log } from '../utils/logger.js';
import { COLORS } from '../config/constants.js';

const windows = new Map<string, { at: number[]; content: string[] }>();

/** Détecte le flood et avertit le membre, sans kick, ban ni timeout automatique. */
export async function runAntiSpam(message: Message) {
  if (!message.guild || message.author.bot) return;
  const key = `${message.guild.id}:${message.author.id}`; const now = Date.now();
  const state = windows.get(key) ?? { at: [], content: [] };
  state.at = state.at.filter(at => now - at < 8_000); state.content = state.content.slice(-6);
  state.at.push(now); state.content.push(message.content); windows.set(key, state);
  const upper = message.content.replace(/[^a-z]/gi, '').match(/[A-Z]/g)?.length ?? 0;
  const letters = message.content.replace(/[^a-z]/gi, '').length;
  const repeated = state.content.filter(content => content === message.content).length >= 3;
  const spam = state.at.length >= 6 || message.content.length > 1_500 || (letters > 10 && upper / letters > .8) || message.mentions.users.size > 6 || repeated;
  if (!spam) return;
  await message.delete().catch(() => null);
  const warnId = `S-${Date.now().toString(36).toUpperCase()}`;
  await Warn.create({ guildId: message.guild.id, userId: message.author.id, moderatorId: message.client.user!.id, reason: 'AntiSpam: comportement de spam détecté', warnId });
  await log(message.client, message.guild, 'AntiSpam • Avertissement', `👤 **Membre :** ${message.author}\n⚠️ **Motif :** spam détecté\n🆔 **Warn :** \`${warnId}\`\n🗑️ **Message :** supprimé`, COLORS.warning);
}
