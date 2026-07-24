import { ChannelType, Client, EmbedBuilder, Guild } from 'discord.js';
import { env } from '../config/env.js';
import { COLORS } from '../config/constants.js';

/** Envoie un journal homogène et lisible dans le salon de logs configuré. */
export async function log(client: Client, guild: Guild | null, category: string, details: string, color = COLORS.primary) {
  console.info(`[${category}] ${details}`);
  if (!guild || !env.logChannelId) return;
  const channel = await guild.channels.fetch(env.logChannelId).catch(() => null);
  if (channel?.type !== ChannelType.GuildText) return;
  const iconURL = client.user?.displayAvatarURL();
  const logEmbed = new EmbedBuilder()
    .setColor(color)
    .setAuthor({ name: 'ATLAS BOT  •  Journal de sécurité', iconURL })
    .setTitle(`ღ ${category}`)
    .setDescription(`> **Détails**\n${details}`)
    .setFooter({ text: `ATLAS RP  •  ${guild.name}` })
    .setTimestamp();
  await channel.send({ embeds: [logEmbed] }).catch(() => null);
}
