import { ChannelType, Client, EmbedBuilder, Guild } from 'discord.js'; import { env } from '../config/env.js'; import { COLORS } from '../config/constants.js';
export async function log(client: Client, guild: Guild | null, title: string, description: string, color = COLORS.primary) {
  console.info(`[${title}] ${description}`);
  if (!guild || !env.logChannelId) return;
  const channel = await guild.channels.fetch(env.logChannelId).catch(() => null);
  if (channel?.type === ChannelType.GuildText) await channel.send({ embeds: [new EmbedBuilder().setColor(color).setTitle(title).setDescription(description).setTimestamp()] }).catch(() => null);
}
