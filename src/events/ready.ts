import { ActivityType, Events } from 'discord.js';
import { registerCommands } from '../handlers/registerCommands.js';

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: any) {
    client.user.setPresence({
      status: 'online',
      activities: [{
        name: 'discord.gg/atlasrpfr',
        type: ActivityType.Streaming,
        url: 'https://www.twitch.tv/atlasrp_officiel' // Obligatoire pour le point violet
      }]
    });

    console.log(`ATLAS BOT connecté : ${client.user.tag}`);

    try { await registerCommands(client); }
    catch (error) { console.error('Échec de l’enregistrement des slash-commandes', error); }
  }
};

