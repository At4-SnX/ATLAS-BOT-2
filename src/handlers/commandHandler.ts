import { Client, Collection } from 'discord.js'; import { readdir } from 'node:fs/promises'; import { join } from 'node:path'; import type { Command } from './Command.js';
declare module 'discord.js' { interface Client { commands: Collection<string, Command>; } }
export async function loadCommands(client: Client) { client.commands = new Collection(); for (const file of await readdir(join(process.cwd(), 'dist/commands'))) { if (!file.endsWith('.js')) continue; const command = (await import(`../commands/${file}`)).default as Command; client.commands.set(command.data.name, command); } }
