import { EmbedBuilder } from 'discord.js';
import { COLORS } from '../config/constants.js';

/** Style visuel unifié d'ATLAS RP pour toutes les réponses du bot. */
export const embed = (description: string, color = COLORS.primary) => new EmbedBuilder()
  .setColor(color)
  .setAuthor({ name: 'ATLAS BOT  •  Protection' })
  .setDescription(`ღ  ${description}\n\n೬  *ATLAS RP — Sécurité, modération et protection.*`)
  .setFooter({ text: 'ATLAS RP  •  discord.gg/atlasrpfr' })
  .setTimestamp();
