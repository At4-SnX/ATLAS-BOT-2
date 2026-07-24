import { Message } from 'discord.js';
import { Warn } from '../models/Warn.js';
import { log } from '../utils/logger.js';
import { COLORS } from '../config/constants.js';

const windows = new Map<string, { at: number[]; content: string[] }>();
const notifiedAt = new Map<string, number>();

/** Détecte le flood et avertit le membre, sans kick, ban ni timeout automatique. */
export async function runAntiSpam(message: Message) {
  if (!message.guild || message.author.bot) return;
  const key = `${message.guild.id}:${message.author.id}`; const now = Date.now();
  const state = windows.get(key) ?? { at: [], content: [] };
  state.at = state.at.filter(at => now - at < 60_000); state.content = state.content.slice(-12);
  state.at.push(now); state.content.push(message.content); windows.set(key, state);
  const upper = message.content.replace(/[^a-z]/gi, '').match(/[A-Z]/g)?.length ?? 0;
  const letters = message.content.replace(/[^a-z]/gi, '').length;
  const repeated = state.content.filter(content => content === message.content).length >= 3;
  const spam = state.at.length > 10 || message.content.length > 1_500 || (letters > 10 && upper / letters > .8) || message.mentions.users.size > 6 || repeated;
  if (!spam) return;
  await message.delete().catch(() => null);
  // Après une alerte, le staff ne reçoit pas de nouvelle notification pendant une minute.
  if ((notifiedAt.get(key) ?? 0) > now - 60_000) return;
  notifiedAt.set(key, now);
  const warnId = `S-${Date.now().toString(36).toUpperCase()}`;
  await Warn.create({ guildId: message.guild.id, userId: message.author.id, moderatorId: message.client.user!.id, reason: 'AntiSpam: comportement de spam détecté', warnId });
  await log(message.client, message.guild, 'AntiSpam • Avertissement staff', `👤 **Membre :** ${message.author}\n⚠️ **Motif :** plus de **10 messages en 1 minute**\n🆔 **Warn :** \`${warnId}\`\n🗑️ **Message :** supprimé\n\n೬ Une seule alerte est envoyée au staff pendant 1 minute.`, COLORS.warning);
}
