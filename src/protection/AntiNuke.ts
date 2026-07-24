import { AuditLogEvent, Guild } from 'discord.js';
import { env } from '../config/env.js';
import { guildConfig } from '../models/GuildConfig.js';
import { log } from '../utils/logger.js';

const actions = new Map<string, number[]>();

/** Sanctionne les actions de nuke, sauf si l'auteur a un rôle protégé. */
export async function checkNuke(guild: Guild, event: AuditLogEvent) {
  const config = await guildConfig(guild.id);
  if (!config.antiNuke) return;
  const audit = await guild.fetchAuditLogs({ type: event, limit: 1 }).catch(() => null);
  const entry = audit?.entries.first();
  if (!entry?.executorId || entry.executorId === guild.ownerId || entry.executorId === guild.client.user?.id) return;
  const executorId = entry.executorId;
  const key = `${guild.id}:${executorId}`;
  const now = Date.now();
  const list = (actions.get(key) ?? []).filter(at => now - at < 15_000);
  list.push(now); actions.set(key, list);
  if (list.length < env.antinukeThreshold) return;
  const member = await guild.members.fetch(executorId).catch(() => null);
  if (!member) return;
  if (env.safeRoleIds.some(roleId => member.roles.cache.has(roleId))) {
    await log(guild.client, guild, 'AntiNuke', `Sanction ignorée pour <@${executorId}> : rôle sécurisé.`, 0xf59e0b);
    return;
  }
  for (const role of member.roles.cache.values()) {
    if (role.editable && role.permissions.any(['Administrator', 'ManageGuild', 'ManageChannels', 'ManageRoles', 'BanMembers', 'KickMembers', 'ManageWebhooks'])) await member.roles.remove(role, 'ATLAS AntiNuke').catch(() => null);
  }
  if (member.kickable) await member.kick('ATLAS AntiNuke: seuil dépassé').catch(() => null);
  await log(guild.client, guild, 'AntiNuke', `Sanction appliquée à <@${executorId}>.`, 0xdc2626);
}
