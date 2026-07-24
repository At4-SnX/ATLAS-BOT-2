import { Client, GatewayIntentBits, Partials } from 'discord.js'; import { connectDatabase } from './database/connect.js'; import { env } from './config/env.js'; import { loadCommands } from './handlers/commandHandler.js'; import { loadEvents } from './handlers/eventHandler.js';
process.on('unhandledRejection',e=>console.error('Unhandled rejection',e));process.on('uncaughtException',e=>console.error('Uncaught exception',e));
const client=new Client({intents:[GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildModeration,GatewayIntentBits.GuildMembers,GatewayIntentBits.MessageContent,GatewayIntentBits.GuildVoiceStates],partials:[Partials.Channel]});
await connectDatabase();await loadCommands(client);await loadEvents(client);await client.login(env.token);
