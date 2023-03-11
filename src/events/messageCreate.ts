import { ChannelType, ColorResolvable, InteractionCollector, Message } from "discord.js";
import { checkPermissions, sendTimedMessage } from "../functions";
import { BotEvent } from "../types";
import mongoose from "mongoose";
import AfkModel from "../schemas/Afk";

const event: BotEvent = {
    name: "messageCreate",
    execute: async (message: Message) => {
        const client = message.client;
        if(!message.member || message.member.user.bot || !message.guild) return;
        
        // 🔖 Ping Reply
        if(message.content == `<@!${message.client.user?.id}>` || message.content == `<@${message.client.user?.id}>`){
            message.reply({ content: await client.translate(`:wave: Hello there, I'm **{***}**, a discord-utility bot!\n{**} You can try out my commands by using my \`/\` commands.`.replace('{***}', `${message.client.user?.username}`).replace('{**}', `<:slash:1076211269545250907>`), message.guild?.id) }).then(async(m) => {
                setTimeout(async() => {
                    await m.delete()
                    await message.delete()
                }, 5000)
            })
        }

        // 💤 AFK Module
        const Afk = await AfkModel.findOne({ userID: message.author.id, guildID: message.guild.id })
        if(Afk){
            if(message.content.toLowerCase().includes("[afk]") || message.content.toLowerCase().includes("{afk}") || message.content.toLowerCase().includes("(afk)")) return;

            Afk.delete().then(async() => {
                message.reply({ content: await client.translate(`You have now left AFK, which was started {***}`.replace('{***}', `<t:${Afk.created}:R>`), message.guild?.id) }).then(async(m) => {
                    setTimeout(async() => {
                        await m.delete()
                    }, 5000)
                })
            })
        }

        if(message.mentions.members.first()) {
            const mentionedMember = message.mentions.members.first();
            if (mentionedMember?.user.bot) return;

            const mentionedAfk = await AfkModel.findOne({ userID: mentionedMember?.id, guildID: message.guild.id });

            if(mentionedAfk) message.reply({ content: `💤 **${mentionedMember?.user.username}** ${await client.translate(`is AFK:`, message.guild?.id)} ${mentionedAfk.reason} • <t:${mentionedAfk.created}:R>` })
        }
    }
}

export default event