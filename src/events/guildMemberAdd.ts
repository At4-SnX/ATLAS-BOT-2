import { AuditLogEvent, Events, GuildMember } from 'discord.js';
import { env } from '../config/env.js';
import { guildConfig } from '../models/GuildConfig.js';
import { log } from '../utils/logger.js';
import { COLORS } from '../config/constants.js';

const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default {
  name: Events.GuildMemberAdd,
  async execute(_client: unknown, member: GuildMember) {
    const config = await guildConfig(member.guild.id);
    if (config.raidMode && !member.user.bot) {
      await log(member.client, member.guild, 'AntiRaid', `👤 **Nouveau membre :** ${member.user}\n⚠️ Raid Mode actif : surveillance renforcée.`, COLORS.warning);
    }
    if (!config.antiBot || !member.user.bot) return;
    // L'audit log est écrit avec un court délai par Discord.
    await pause(1_000);
    const audit = await member.guild.fetchAuditLogs({ type: AuditLogEvent.BotAdd, limit: 5 }).catch(() => null);
    const entry = audit?.entries.find(item => item.targetId === member.user.id && Date.now() - item.createdTimestamp < 15_000);
    const addedByOwner = entry?.executorId === member.guild.ownerId;
    const allowed = env.allowedBotIds.includes(member.user.id);
    if (addedByOwner || allowed) {
      await log(member.client, member.guild, 'AntiBot • Autorisé', `🤖 **Bot :** ${member.user}\n✅ Ajout autorisé ${addedByOwner ? 'par le propriétaire' : 'via la liste blanche'}.`, COLORS.success);
      return;
    }
    if (member.kickable) await member.kick('ATLAS AntiBot : bot non autorisé').catch(() => null);
    await log(member.client, member.guild, 'AntiBot • Intervention', `🤖 **Bot :** ${member.user}\n👤 **Ajouté par :** ${entry?.executorId ? `<@${entry.executorId}>` : 'inconnu'}\n⛔ **Action :** ${member.kickable ? 'expulsion du bot non autorisé' : 'échec : hiérarchie insuffisante'}.`, COLORS.danger);
  }
};
