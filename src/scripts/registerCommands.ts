import { Client, GatewayIntentBits } from 'discord.js';
import { loadCommands } from '../handlers/commandHandler.js';
import { registerCommands } from '../handlers/registerCommands.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
await loadCommands(client);
await registerCommands(client);
