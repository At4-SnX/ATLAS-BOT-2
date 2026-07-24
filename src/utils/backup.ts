import { ChannelType, Guild } from 'discord.js'; import { Backup } from '../models/Backup.js';
export async function saveGuild(guild: Guild, createdBy: string) {
  const roles = guild.roles.cache.filter(r=>!r.managed && r.id!==guild.id).sort((a,b)=>a.position-b.position).map(r=>({name:r.name,color:r.color,hoist:r.hoist,mentionable:r.mentionable,permissions:r.permissions.bitfield.toString(),position:r.position}));
  const channels = guild.channels.cache.sort((a,b)=>(a as any).rawPosition-(b as any).rawPosition).map(c=>({name:c.name,type:c.type,parentName:(c as any).parent?.name ?? null,position:(c as any).rawPosition,topic:'topic' in c?(c as any).topic:null,nsfw:'nsfw' in c?(c as any).nsfw:false,bitrate:'bitrate' in c?(c as any).bitrate:null,userLimit:'userLimit' in c?(c as any).userLimit:null,rateLimitPerUser:'rateLimitPerUser' in c?(c as any).rateLimitPerUser:null,overwrites:(c as any).permissionOverwrites?.cache.map((o:any)=>({id:o.id,type:o.type,allow:o.allow.bitfield.toString(),deny:o.deny.bitfield.toString()}))??[]}));
  await Backup.create({guildId:guild.id,createdBy,data:{roles,channels}});
}
export async function loadGuild(guild: Guild) {
  const backup=await Backup.latest(guild.id); if(!backup) throw new Error('Aucune sauvegarde trouvée.'); const data=backup.data as any;
  const createdCategories=new Map<string,string>();
  for(const c of data.channels.filter((x:any)=>x.type===ChannelType.GuildCategory)){const n=await guild.channels.create({name:c.name,type:ChannelType.GuildCategory,position:c.position});createdCategories.set(c.name,n.id);}
  for(const r of data.roles){if(!guild.roles.cache.some(x=>x.name===r.name)) await guild.roles.create({name:r.name,color:r.color,hoist:r.hoist,mentionable:r.mentionable,permissions:BigInt(r.permissions),reason:'ATLAS restore'});}
  for(const c of data.channels.filter((x:any)=>x.type!==ChannelType.GuildCategory)){if(guild.channels.cache.some(x=>x.name===c.name&&x.type===c.type))continue; const parent=c.parentName?createdCategories.get(c.parentName):undefined; await guild.channels.create({name:c.name,type:c.type,parent,position:c.position,topic:c.topic??undefined,nsfw:c.nsfw,bitrate:c.bitrate??undefined,userLimit:c.userLimit??undefined,rateLimitPerUser:c.rateLimitPerUser??undefined});}
}
