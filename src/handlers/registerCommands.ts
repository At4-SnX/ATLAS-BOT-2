import { Client, REST, Routes } from 'discord.js';
import { env } from '../config/env.js';

/** Enregistre les commandes au démarrage. GUILD_ID rend la mise à jour instantanée. */
export async function registerCommands(client: Client): Promise<void> {
  const body = [...client.commands.values()].map(command => command.data.toJSON());
  const rest = new REST({ version: '10' }).setToken(env.token);
  const route = env.guildId ? Routes.applicationGuildCommands(env.clientId, env.guildId) : Routes.applicationCommands(env.clientId);
  await rest.put(route, { body });
  console.log(`${body.length} slash-commandes enregistrées (${env.guildId ? 'serveur' : 'global'}).`);
}
