import { ChannelType, ColorResolvable, InteractionCollector, Message, TextChannel } from "discord.js";
import { checkPermissions, sendTimedMessage } from "../functions";
import { BotEvent } from "../types";
import mongoose from "mongoose";
import AfkModel from "../schemas/Afk";
import SettingModel from "../schemas/Settings";

const event: BotEvent = {
    name: "messageDelete",
    execute: async (message: Message) => {
        const client = message.client;
        if(!message.member || message.member.user.bot || !message.guild) return;
        
        // SNIPE MESSAGE
        const snipes = message.client.snipe.get(message.channel.id) || [];
        snipes.unshift({
        snipeid: message.id,
        content: message.content ? message.content : null,
        author: message.author,
        image: message.attachments ? message.attachments.map((a) =>  a.proxyURL) : null,
        timestamp: Date.now(),
        date: new Date().toLocaleString("en-GB", {
        dateStyle: "full",
        timeStyle: "short",
        }),
    });
    snipes.splice(10);
    message.client.snipe.set(message.channel.id, snipes);

    // ANTI GHOST MESSAGE
    const data = await SettingModel.findOne({ guildID: message.guild.id });
    if(data) {
    if(data?.antighostmessage == true) {
        const webhook = await (message.channel as TextChannel).fetchWebhooks();
        const webhook2 = webhook.find((w: any) => w.name === message.author.username);
            (message.channel as TextChannel).createWebhook({
                name: message.member.nickname ? message.member.nickname : message.author.username,
                avatar: message.guild.members.cache.get(message.author.id).displayAvatarURL(),
            }).then(async (webhook: any) => {
                if(Date.now() - message.createdTimestamp > 180000) return;
                    if(message.reference) {
                        const reply = await message.channel.messages.fetch(message.reference.messageId);
                        if(reply) {
                            await webhook.send({
                                content: `• **Replying to [${reply.author.tag}](<${reply.url}>)**\n`+message.content,
                                username: message.author.username,
                                avatarURL: message.guild.members.cache.get(message.author.id).displayAvatarURL(),
                                allowedMentions: { parse: [] },
                            });
                            await webhook.delete();
                        }
                        } else {
                await webhook.send({
                    content: message.content,
                    username: message.member.nickname ? message.member.nickname : message.author.username,
                    avatarURL: message.guild.members.cache.get(message.author.id).displayAvatarURL(),
                    allowedMentions: { parse: [] },
                });
                await webhook.delete();
        }
            });
        }
    }
    }
    }

export default event