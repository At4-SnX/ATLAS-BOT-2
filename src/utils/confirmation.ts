import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ComponentType } from 'discord.js'; import { embed } from './embeds.js';
export async function confirm(i: ChatInputCommandInteraction, text: string): Promise<boolean> {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setCustomId('confirm').setLabel('Confirmer').setEmoji('✅').setStyle(ButtonStyle.Danger), new ButtonBuilder().setCustomId('cancel').setLabel('Annuler').setEmoji('❌').setStyle(ButtonStyle.Secondary));
  const message = await i.reply({ embeds: [embed(text)], components: [row], ephemeral: true, fetchReply: true });
  try { const click = await message.awaitMessageComponent({ componentType: ComponentType.Button, time: 30_000, filter: b => b.user.id === i.user.id }); await click.update({ embeds: [embed(click.customId === 'confirm' ? 'Confirmation reçue.' : 'Opération annulée.')], components: [] }); return click.customId === 'confirm'; } catch { await i.editReply({ embeds: [embed('Confirmation expirée.')], components: [] }); return false; }
}
