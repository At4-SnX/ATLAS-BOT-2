import { EmbedBuilder } from 'discord.js'; import { COLORS } from '../config/constants.js';
export const embed = (description: string, color = COLORS.primary) => new EmbedBuilder().setColor(color).setDescription(description).setTimestamp();
