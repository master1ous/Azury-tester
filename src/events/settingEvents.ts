import { Client, Message, ChannelType, PermissionsBitField, Collection } from "discord.js";
import { BotEvent } from "../types";
import axios from "axios";

import model from "../schemas/Settings";


const anti_spam = new Collection();


const event: BotEvent = {
    name: "messageCreate",
    execute: async (message: Message) => {
        
const client = require('../index')

        const data = await model.findOne({ guildID: message.guild?.id })
        if(!data) return;

        // 💬 Anti Spam   | { log: 1234567890, bypasses: [{ type: "user", id: "1234567890" }, { type: "role", id: "1234567890" }], action: "kick", amount: 5, time: 10000 },
        if(data.anti_spam[0]){
            if(message.channel.type != ChannelType.GuildText) return;
            if(message.member?.permissions.has(PermissionsBitField.Flags.ManageMessages) || message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) return;
            
            data.anti_spam[0].forEach((bypass: any) => {
                if(bypass.type == "user" && bypass.id == message.author.id) return;
                if(bypass.type == "role" && message.member?.roles.cache.has(bypass.id)) return;
            })

            if(anti_spam.has(message.author.id)){
                
                if((anti_spam.get(message.author.id) as any).messages.length >= data.anti_spam[0].amount){
                    
                    if((anti_spam.get(message.author.id) as any).messages[(anti_spam.get(message.author.id) as any).messages.length - 1].timestamp - (anti_spam.get(message.author.id) as any)?.messages[0].timestamp < data.anti_spam[0].time){
                        if(data.anti_spam[0].action == "kick"){
                            message.member?.kick()
                            message.reply({ content: `You have been kicked for spamming.` })
                        }
                        if(data.anti_spam[0].action == "ban"){
                            message.member?.ban()
                            message.reply({ content: `You have been banned for spamming.` })
                        }
                        if(data.anti_spam[0].action == "delete"){
                            message.delete()
                            message.reply({ content: `You are not allowed to spam, or send more than ${data.anti_spam[0].amount} messages in ${data.anti_spam[0].time / 1000} seconds.` })
                        }
                    }
                }
            }
        }


        // 📝 Anti Mass-Mention   | { log: 1234567890, bypasses: [{ type: "user", id: "1234567890" }, { type: "role", id: "1234567890" }], action: "kick", amount: 5 },
        if(data.anti_mass_mention[0]){
            if(message.channel.type != ChannelType.GuildText) return;
            if(message.member?.permissions.has(PermissionsBitField.Flags.ManageMessages) || message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) return;

            data.anti_mass_mention[0].forEach((bypass: any) => {
                if(bypass.type == "user" && bypass.id == message.author.id) return;
                if(bypass.type == "role" && message.member?.roles.cache.has(bypass.id)) return;
            })

            if(message.content.match(/@/g)?.length >= data.anti_mass_mention[0].amount){
                if(data.anti_mass_mention[0].action == "kick"){
                    message.member?.kick()
                    message.reply({ content: `You have been kicked for mass-mentioning more than ${data.anti_mass_mention[0].amount} people.` })
                }
                if(data.anti_mass_mention[0].action == "ban"){
                    message.member?.ban()
                    message.reply({ content: `You have been banned for mass-mentioning more than ${data.anti_mass_mention[0].amount} people.` })
                }
                if(data.anti_mass_mention[0].action == "delete"){
                    message.delete()
                    message.reply({ content: `You are not allowed to mass-mention more than ${data.anti_mass_mention[0].amount} people.` })
                }
            }
        }


        // 🤖 Anti Alt   | { log: 1234567890, action: "kick", days: 7 },
        if(data.anti_alt[0]){
            if(message.channel.type != ChannelType.GuildText) return;
            if(message.member?.permissions.has(PermissionsBitField.Flags.ManageMessages) || message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) return;

            if(message.author.createdAt.getTime() + (data.anti_alt[0].days * 86400000) > Date.now()){
                if(data.anti_alt[0].action == "kick"){
                    message.member?.kick()
                    message.reply({ content: `You have been kicked for having an alt account.` })
                }
                if(data.anti_alt[0].action == "ban"){
                    message.member?.ban()
                    message.reply({ content: `You have been banned for having an alt account.` })
                }
                if(data.anti_alt[0].action == "delete"){
                    message.delete()
                    message.reply({ content: `You are not allowed to have an alt account.` })
                }
            }
        }


        // 🤬 Bad-Words   | { log: 1234567890, bypasses: [{ type: "user", id: "1234567890" }, { type: "role", id: "1234567890" }], action: "kick", categories: ["hate", "hate/threatening", "self-harm", "sexual", "sexual/minors", "violence", "violence/graphic"], extra_words: ["word1", "word2"] },
        if(data.bad_words[0]){
            if(message.channel.type != ChannelType.GuildText) return;
            if(message.member?.permissions.has(PermissionsBitField.Flags.ManageMessages) || message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) return;

            data.bad_words[0].extra_words.forEach((word: string) => {
                if(message.content.toLowerCase().includes(word.toLowerCase())){
                    if(data.bad_words[0].action == "kick"){
                        message.member?.kick()
                        message.reply({ content: `You have been kicked for using a bad word.` })
                    } else if(data.bad_words[0].action == "ban"){
                        message.member?.ban()
                        message.reply({ content: `You have been banned for using a bad word.` })
                    } else if(data.bad_words[0].action == "delete"){
                        message.delete()
                        message.reply({ content: `You are not allowed to use bad words.` })
                    }
                }
            })

            const request = await axios.get("https://api.openai.com/v1/moderations", { headers: { "Authorization": `Bearer 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`, "Content-Type": "application/json" }, data: { "input": message.content } })
            const data2 = request.data.results[0]

            let flagged = false;

            if(data2.flagged){
                if(data2.categories['sexual'] || data2.categories['sexual/minors'] || data2.categories['violence'] || data2.categories['violence/graphic'] || data2.categories['hate'] || data2.categories['hate/threatening'] || data2.categories['self-harm']){
                    flagged = true;
                }
            }

            if(flagged){
                if(data.bad_words[0].action == "kick"){
                    message.member?.kick()
                    message.reply({ content: `You have been kicked for using a bad word.` })
                } else if(data.bad_words[0].action == "ban"){
                    message.member?.ban()
                    message.reply({ content: `You have been banned for using a bad word.` })
                } else if(data.bad_words[0].action == "delete"){
                    message.delete()
                    message.reply({ content: `You are not allowed to use bad words.` })
                }
            }
        }
    }
}

export default event;