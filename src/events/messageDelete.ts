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

    const data = await SettingModel.findOne({ guildID: message.guild.id });
    if(!data) return;
    console.log('here')
    if(data?.antighostmessage == true) {
        console.log('there')
        // resend the message as a webhook with the user's name and avatar, also check if there is already a webhook like that
        const webhook = await (message.channel as TextChannel).fetchWebhooks();
        const webhook2 = webhook.find((w: any) => w.name === message.author.username);
            (message.channel as TextChannel).createWebhook({
                name: message.author.username,
                avatar: message.author.displayAvatarURL(),
            }).then(async (webhook: any) => {
                if(Date.now() - message.createdTimestamp > 180000) return;
                    // check if the message is replying to another message
                    if(message.reference) {
                        const reply = await message.channel.messages.fetch(message.reference.messageId);
                        if(reply) {
                            await webhook.send({
                                content: `• **Replying to <[${reply.author.tag}](${reply.url})>**\n`+message.content,
                                username: message.author.username,
                                avatarURL: message.author.displayAvatarURL(),
                                allowedMentions: { parse: [] },
                            });
                            await webhook.delete();
                        }
                        } else {
                await webhook.send({
                    content: message.content,
                    username: message.author.username,
                    avatarURL: message.author.displayAvatarURL(),
                    allowedMentions: { parse: [] },
                });
                await webhook.delete();
        }
            });
        }
    }
    }

export default event