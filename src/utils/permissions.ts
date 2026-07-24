import { ChatInputCommandInteraction, GuildMember, PermissionFlagsBits } from 'discord.js';
import { COLORS } from '../config/constants.js';
import { env } from '../config/env.js';
import { embed } from './embeds.js';

const hasAnyRole = (member: GuildMember, roleIds: string[]) => roleIds.some(roleId => member.roles.cache.has(roleId));

/** Centralise les protections de hiérarchie et les rôles protégés. */
export async function canModerate(i: ChatInputCommandInteraction, target: GuildMember, permission: bigint) {
  const actor = i.member as GuildMember;
  const me = i.guild!.members.me!;
  if (!actor.permissions.has(permission)) { await i.reply({ embeds: [embed('Vous n’avez pas la permission requise.', COLORS.danger)], ephemeral: true }); return false; }
  if (!me.permissions.has(permission)) { await i.reply({ embeds: [embed('Je n’ai pas la permission requise.', COLORS.danger)], ephemeral: true }); return false; }
  if (hasAnyRole(target, env.safeRoleIds)) { await i.reply({ embeds: [embed('Ce membre possède un rôle sécurisé et ne peut pas être ciblé.', COLORS.danger)], ephemeral: true }); return false; }
  if (hasAnyRole(actor, env.staffRoleIds) && hasAnyRole(target, env.staffRoleIds)) { await i.reply({ embeds: [embed('Un membre du staff ne peut pas agir sur un autre membre du staff.', COLORS.danger)], ephemeral: true }); return false; }
  if (target.id === i.guild!.ownerId || target.id === i.user.id || (target.roles.highest.position >= actor.roles.highest.position && i.user.id !== i.guild!.ownerId) || target.roles.highest.position >= me.roles.highest.position) { await i.reply({ embeds: [embed('Hiérarchie de rôles insuffisante.', COLORS.danger)], ephemeral: true }); return false; }
  return true;
}
export const P = PermissionFlagsBits;
