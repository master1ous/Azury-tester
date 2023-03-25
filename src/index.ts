import { Client, GatewayIntentBits, ShardingManager, Collection, PermissionFlagsBits,} from "discord.js";
import { SlashCommand, SlashCommandList } from "./types";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
import axios from "axios";
import { PasteClient, Publicity, ExpireDate } from "pastebin-api";
import { execSync } from "child_process";
import settingsModule from "./schemas/Settings";
import premiumModel from "./schemas/PremiumUser";
import fetch from "node-fetch";
import { BotClient } from "./structures/botClient";

const client = new BotClient();

config()
module.exports = client;

client.pastebin = new PasteClient("mXYR3ujWccXKQx1pnSviwZ92BF_j5ASm");

client.translate = async function(text: string, guild: string) {
   return text;
}

client.getInvites = async function(user: string, guild: string, type: string) {
    if(type == 'total') {
        const guildInvites = await client.guilds.cache.get(guild).invites.fetch()
        const userInvites = guildInvites.filter(i => i.inviter.id === user)
        let inviteCount = 0
        for (const invite of userInvites) {
            const [code, inviteData] = invite
            inviteCount += inviteData.uses
        }
        return inviteCount;
    } 
}

client.awaitReply = async function(interaction: any, inter: any) {
    const filter = (m: any) => m.author.id === interaction.user.id
    const msg = await interaction.channel.awaitMessages({ filter, max: 1, time: 120000 })
    .catch(() => {
        return false;
    })
    if (!msg) return false
    if(msg) msg.first().delete()
    return msg.first().content
}
client.awaitRoleReply = async function(interaction: any, inter: any) {
    const filter = (m: any) => m.author.id === interaction.user.id
    const msg = await interaction.channel.awaitMessages({ filter, max: 1, time: 120000 })
    .catch(() => {
        return false;
    })
    if (!msg) return false
    // check if message mentions a role
    if(!msg.first().mentions.roles.first()) return false
    if(msg) msg.first().delete()
    return msg.first().mentions.roles.first()
}
client.awaitChannelReply = async function(interaction: any, inter: any) {
    const filter = (m: any) => m.author.id === interaction.user.id
    const msg = await interaction.channel.awaitMessages({ filter, max: 1, time: 120000 })
    .catch(() => {
        return false;
    })
    if (!msg) return false
    // check if message mentions a channel
    if(!msg.first().mentions.channels.first()) return false
    if(msg) msg.first().delete()
    return msg.first().mentions.channels.first()
}
client.awaitEmojiReply = async function(interaction: any, inter: any) {
    const filter = (m: any) => m.author.id === interaction.user.id
    const msg = await interaction.channel.awaitMessages({ filter, max: 1, time: 120000 })
    .catch(() => {
        return false;
    })
    if (!msg) return false
    // check if message mentions a valid emoji
    if(!msg.first().content.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)) return false
    if(msg) msg.first().delete()  
    return msg.first().content.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)[3]
}


client.checkPremium = async function(user: string) {
    const guild = client.guilds.cache.get('1012015808345555055') // @Azury Studios
    if(!guild) return false
    const member = guild.members.cache.get(user)
    if(!member) return `cactus_not_in_gu_ld`
    const role = guild.roles.cache.get('1080509365582311644') // @Premium role
    if(!role) return false
    if(!member.roles.cache.has(role.id)) return false
    return true;
}

client.checkURL = async function(url: any) {
        const res = await fetch(url);
        const buff = await res.blob();
        return buff.type.startsWith('image/');
}
client.embedColor = async function(user: any) {
    const { createCanvas, loadImage } = require('canvas')
    const canvas = createCanvas(100, 100)
    const ctx = canvas.getContext('2d')
    const imags = user.displayAvatarURL().replace('webp', 'png')
    const image = await loadImage(imags)
    ctx.drawImage(image, 0, 0, 100, 100)
    const domcolor = require('domcolor')
    const color = await domcolor(canvas.toBuffer())
    return color.hex;
}
client.embedUrlColor = async function(url: any) {
    const { createCanvas, loadImage } = require('canvas')
    const canvas = createCanvas(100, 100)
    const ctx = canvas.getContext('2d')
    const imags = url.replaceAll('webp', 'png').replaceAll('gif', 'png').replaceAll('jpg', 'png').replaceAll('jpeg', 'png').replaceAll('webm', 'png').replaceAll('mp4', 'png').replaceAll('mp3', 'png')
    const image = await loadImage(imags)
    ctx.drawImage(image, 0, 0, 100, 100)
    const domcolor = require('domcolor')
    const color = await domcolor(canvas.toBuffer())
    return color.hex;
}

const openai_key = 'Bearer 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'
client.openai = async function(type: string, prompt: string) {
    if(type == 'gpt') {
        const response = await axios("https://api.openai.com/v1/completions", { data: JSON.stringify({ model: "text-davinci-003", prompt: prompt, temperature: 0, max_tokens: 3000, }),
            method: "POST",
            headers: { Authorization: openai_key, "Content-Type": "application/json", },
        }).catch(async (e) => { return 'OFFLINE_ERR' })
        const answer = (response as any).data.choices[0].text
        return answer;
    } else if(type == 'dalle') {
        const response = await axios("https://api.openai.com/v1/images/generations", { data: JSON.stringify({ prompt: prompt, size: "1024x1024", n: 1, }),
            method: "POST",
            headers: { Authorization: openai_key, "Content-Type": "application/json", },
        }).catch(async (e) => { return 'OFFLINE_ERR' })
        const answer = (response as any).data.data[0].url
        return answer;
    } else {
        return 'Error, invalid type was provided in the code!';
    }
}

client.timestamp = async function getTime(args: any, eph = true, arg1: any) {
    args = args.join(' ');
    args = ' ' + args;
    try {
        let output = execSync("bash src/time.sh" + args);
        let message;
        message = `<:cactus_timestamp:1063598708261916733> ` + output.toString() + "" + "<:cactus_timestamp2:1063598812603625603> `" + output.toString() + "`"
        return message;
    } catch (e) {
        console.log(e.message)
        return "Invalid time string, check https://tinyurl.com/cactus-manual for more info";
    }
}