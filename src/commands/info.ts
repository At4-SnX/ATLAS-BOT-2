import { SlashCommandBuilder } from 'discord.js';
import type { Command } from '../handlers/Command.js';
import { embed } from '../utils/embeds.js';

const helpText = [
  '## ღ Module Protection', '', '🛡️ **Modération**',
  '`/moderation ban` • `/moderation tempban` • `/moderation unban`', '',
  '`/moderation kick` • `/moderation mute` • `/moderation timeout` • `/moderation untimeout`', '',
  '`/moderation warn` • `/moderation unwarn` • `/moderation warns`', '',
  '`/moderation clear` • `/moderation slowmode`', '', '`/moderation lock` • `/moderation unlock`', '',
  '🔒 **Sécurité**', '`/security antinuke`', '', '`/security antibot`', '', '`/security raidmode`', '',
  '💾 **Sauvegardes**', '`/backup save`', '', '`/backup load`', '',
  'ℹ️ **Informations**', '`/info help`', '', '`/info ping`', '',
  '✎ **Notes Importantes**', '೬ Les actions sensibles nécessitent une **confirmation manuelle** pour éviter toute erreur.', '',
  '೬ Les commandes critiques sont **strictement réservées au propriétaire** ainsi qu’aux **IDs de confiance**.'
].join('\n');

export default {
  data: new SlashCommandBuilder().setName('info').setDescription('Aide et diagnostic')
    .addSubcommand(s => s.setName('ping').setDescription('État du bot'))
    .addSubcommand(s => s.setName('help').setDescription('Aide')),
  async execute(i) {
    if (i.options.getSubcommand() === 'help') return void await i.reply({ embeds: [embed(helpText)] });
    const mem = process.memoryUsage(); const cpu = process.cpuUsage();
    const status = [
      '## ⚡ État d’ATLAS BOT', '', `📡 **Ping API :** \`${i.client.ws.ping}ms\``, `🌐 **Ping WebSocket :** \`${i.client.ws.ping}ms\``,
      `⏱️ **Temps de réponse :** \`${Date.now() - i.createdTimestamp}ms\``, `🕒 **Uptime :** <t:${Math.floor((Date.now() - i.client.uptime!) / 1000)}:R>`,
      `💾 **RAM utilisée :** \`${(mem.rss / 1024 / 1024).toFixed(1)} MB\``, `⚙️ **CPU utilisée :** \`${((cpu.user + cpu.system) / 1e6).toFixed(2)} s\``, '', '✦ Tous les systèmes sont opérationnels.'
    ].join('\n');
    await i.reply({ embeds: [embed(status)] });
  }
} satisfies Command;
