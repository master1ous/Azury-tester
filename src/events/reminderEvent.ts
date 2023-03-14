import { Client, DiscordAPIError, TextChannel } from "discord.js";
import { BotEvent } from "../types";
import { color } from "../functions";
import Discord from "discord.js";
import RemindersModel from "../schemas/Reminder";
import GiveawayModel from "../schemas/Giveaway";
import ImagineModel from "../schemas/Imagine";
import ms from "ms";

const event : BotEvent = {
    name: "ready",
    once: true,
    execute: (client : Client) => {

        setInterval(async() => {
        const imagines = await ImagineModel.find({})
        imagines.forEach(async(imagine) => {
            if((imagine.resetAt as any) <= Date.now()){
                imagine.usages = 0
                imagine.save()
            }
        })

        const reminders = await RemindersModel.find({})
        reminders.forEach(async(reminder) => {
            if((reminder.time as any) <= Date.now()){
                const user = await client.users.fetch(reminder.userID)
                if(!user) return reminder.delete();
                const checkLoop = reminder.loop;
                if(checkLoop === true) {
                const newReminder = new RemindersModel({
                    userID: reminder.userID,
                    reminderID: reminder.reminderID,
                    date: reminder.date,
                    time: Date.now() + ms(reminder.parseDate),
                    reminder: reminder.reminder,
                    createdAt: reminder.createdAt,
                    channel: reminder.channel,
                    loop: reminder.loop,
                    parseDate: reminder.parseDate,
                })
                newReminder.save()
                
                user.send({ content: `Your reminder which was created at **${reminder.createdAt}**\n\`${reminder.reminder}\`` }).then(() => {
                reminder.delete()
                }).catch(() => {
                const channel = client.channels.cache.get(reminder.channel)
                if(!channel) return reminder.delete();
                (channel as any).send({ content: `${user} Your reminder which was created at **${reminder.createdAt}**\n\`${reminder.reminder}\`` })
                reminder.delete()
                })
                } else {
                user.send({ content: `Your reminder which was created at **${reminder.createdAt}**\n\`${reminder.reminder}\`` }).then(() => {
                reminder.delete()
                }).catch(() => {
                const channel = client.channels.cache.get(reminder.channel)
                if(!channel) return reminder.delete();
                (channel as any).send({ content: `${user} Your reminder which was created at **${reminder.createdAt}**\n\`${reminder.reminder}\`` })
                reminder.delete()
                })
            }
            }
            })
            
            const giveaways = await GiveawayModel.find({})
            giveaways.forEach(async(giveaway) => {
                if((giveaway.ends as any) <= Date.now()){
                    if(giveaway.ended === true) return;
                    const channel = client.channels.cache.get(giveaway.channelID)
                    if(!channel) return giveaway.delete();

                    const winnerCount = giveaway.winnerCount || 1;
                    const participants = giveaway.participants || [];
                    const prize = giveaway.prize || "No prize";
                    const ended = giveaway.ended || false;

                    if(giveaway.participants.length < 1) {
                        giveaway.delete();
                        return (channel as any).send({ content: `:x: No one participated in the giveaway for **${prize}**` })
                    }

                    const winners = participants
                        .sort(() => Math.random() - Math.random())
                        .slice(0, winnerCount);

                    winners.forEach(async(winner) => {
                        const user = client.users.cache.get(winner);
                        if(!user) return;
                        user.send({ content: `Congrats, looks like you have won **${giveaway.prize}** in **${giveaway.guild}**` })
                    });
                    
                    (channel as any).send({ content: `:tada: Congrats ${winners.map(r => `<@${r}>`)} you have won ${giveaway.prize}` }).then(() => {
                        
                        giveaway.ended = true;
                        giveaway.save()
                    }).catch(() => {
                        // update giveaway.ended to be true
                        giveaway.ended = true;
                        giveaway.save()
                    })
                } 
            })
        }, 10000)
        }
}

export default event;