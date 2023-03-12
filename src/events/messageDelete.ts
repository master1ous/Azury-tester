import { ChannelType, ColorResolvable, InteractionCollector, Message } from "discord.js";
import { checkPermissions, sendTimedMessage } from "../functions";
import { BotEvent } from "../types";
import mongoose from "mongoose";
import AfkModel from "../schemas/Afk";

const event: BotEvent = {
    name: "messageDelete",
    execute: async (message: Message) => {
        const client = message.client;
        if(!message.member || message.member.user.bot || !message.guild) return;
        
        const snipes = message.client.snipe.get(message.channel.id) || [];
        snipes.unshift({
        content: message.content,
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
    }
}

export default event