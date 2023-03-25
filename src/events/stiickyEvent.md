import { Client, Message, ChannelType, PermissionsBitField, Collection, ButtonBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import { BotEvent } from "../types";
import axios from "axios";

import model from "../schemas/Settings";
const event: BotEvent = {
    name: "messageCreate",
    execute: async (message: Message) => {
        
const client = require('../index')

const data = await model.findOne({ guildID: message.guild.id })

const datas = await model.find({ guildID: message.guild.id })
if(!data) return;
if(!data.sticky_messages) return;

if(message.author.bot) return;

if(message.channel.id !== `${data?.sticky_messages[0].channel}`) return;




    datas.forEach(async respond => {

        console.log("Got for each")
    


        if(data.sticky_messages[0].message){
            console.log("Found an id")
            client.guilds.cache.get(message.guild.id).channels.cache.get(message.channel.id).messages.fetch(data.sticky_messages[0].message).then(async (m: any) => {
                m.delete()
                console.log("Should be delete")
            })

        


if(!data.sticky_messages[0].btnUrl && !data.sticky_messages[0].btnLabel && !data.sticky_messages[0].btnEmoji){
    console.log("Should be there")

    message.channel.send(respond.sticky_messages[0].content).then((msg) => {

        model.findOneAndUpdate({ guildID: message.guild.id, "sticky_messages.channel": message.channel.id }, { $set: { "sticky_messages.$.content": msg.content, "sticky_messages.$.message": msg.id, "sticky_messages.$.channel": message.channel.id } }, { new: true }).exec()
    })
}

if(data.sticky_messages[0].btnUrl && data.sticky_messages[0].btnLabel && !data.sticky_messages[0].btnEmoji){
    console.log("Should be there2")
    message.channel.send({content: `${data.sticky_messages[0].content}`, components: [
        new ActionRowBuilder<ButtonBuilder>()
                    .addComponents([
                        new ButtonBuilder()
					.setLabel(`${data.sticky_messages[0].btnLabel}`)
                    .setURL(`${data.sticky_messages[0].btnUrl}`)
					.setStyle(ButtonStyle.Link),
                    ])
    ]}).then((msg) => {
        console.log("Should be connect")

        model.findOneAndUpdate({ guildID: message.guild.id, "sticky_messages.channel": message.channel.id }, { $set: { "sticky_messages.$.content": msg.content, "sticky_messages.$.message": msg.id, "sticky_messages.$.channel": message.channel.id, "sticky_messages.$.btnUrl": data.sticky_messages[0].btnUrl, "sticky_messages.$.btnLabel": data.sticky_messages[0].btnLabel} }, { new: true }).exec()
    })
}


if(data.sticky_messages[0].btnUrl && data.sticky_messages[0].btnLabel && data.sticky_messages[0].btnEmoji){
    console.log("Should be there3")

    message.channel.send({content: `${respond.sticky_messages[0].content}`, components: [
        new ActionRowBuilder<ButtonBuilder>()
                    .addComponents([
                        new ButtonBuilder()
					.setLabel(`${data.sticky_messages[0].btnLabel}`)
                    .setURL(`${data.sticky_messages[0].btnUrl}`)
                    .setEmoji(`${data.sticky_messages[0].btnEmoji}`)
					.setStyle(ButtonStyle.Link),
                    ])
    ]}).then((msg) => {

        model.findOneAndUpdate({ guildID: message.guild.id, "sticky_messages.channel": message.channel.id }, { $set: { "sticky_messages.$.content": msg.content, "sticky_messages.$.message": msg.id, "sticky_messages.$.channel": message.channel.id, "sticky_messages.$.btnUrl": data.sticky_messages[0].btnUrl, "sticky_messages.$.btnLabel": data.sticky_messages[0].btnLabel,  "sticky_messages.$.btnEmoji": data.sticky_messages[0].btnEmoji} }, { new: true }).exec()
    })

}


    
        }
    
    })


   
       
    
}
}

export default event;