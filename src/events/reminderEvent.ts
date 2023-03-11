import { Client, DiscordAPIError } from "discord.js";
import { BotEvent } from "../types";
import { color } from "../functions";
import Discord from "discord.js";
import RemindersModel from "../schemas/Reminder";
import GiveawayModel from "../schemas/Giveaway";
import ms from "ms";

const event : BotEvent = {
    name: "ready",
    once: true,
    execute: (client : Client) => {

        setInterval(async() => {
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
        let winners = [] as any;
        const giveaways = await GiveawayModel.find({ ended: false})
        giveaways.forEach(async(giveaway) => {
            if((giveaway.ends as any) <= Date.now()){
                const channel = client.channels.cache.get(giveaway.channelID)
                if(!channel) return giveaway.delete();
                if(giveaway.participants.length < giveaway.winnerCount) {
                  (channel as any).send({ content: `The giveaway for **${giveaway.prize}** has been cancelled, not enough participants` });
                  const message = await (channel as any).messages.fetch(giveaway.giveawayID)
                if(!message) return giveaway.delete();

                const row = new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`giveaway_${giveaway.giveawayID}`)
                    .setLabel(`Participate`)
                    .setEmoji(`1065399898440208484`)
                    .setDisabled(true)
                    .setStyle(Discord.ButtonStyle.Secondary),
                    new Discord.ButtonBuilder()
                    .setCustomId(`participants_${giveaway.giveawayID}`)
                    .setLabel(`Participants`)
                    .setDisabled(true)
                    .setStyle(Discord.ButtonStyle.Secondary),
                )

                message.edit({ content: `:tada: GIVEAWAY CANCELLED :tada:`, components: [row] })

                  giveaway.delete(); 
                } else {
                let participants = giveaway.participants;

                giveaway.ended = true
                giveaway.save()

                    for (let i = 0; i < Number(giveaway.winnerCount); i++) {
                        const winner = participants[Math.floor(Math.random() * participants.length)];
                        if (!winner) return;
                        winners.push(winner);

                        if (i == (Number(giveaway.winnerCount) - 1)) {
                            winners.forEach(async (_winner: any, _index: any) => {

                            if (!_winner) 
                            {winners[_index] = undefined} else {
                            _winner.send({ content: `You have won the giveaway for **${giveaway.prize}**` }).catch(() => {})
                            winners[_index] = _winner||{};
                            }
                        })

                (channel as any).send({ content: `The giveaway for **${giveaway.prize}** has ended! The winners are as follows:\n• ${winners.join(", ")}` })

                const message = await (channel as any).messages.fetch(giveaway.giveawayID)
                if(!message) return giveaway.delete();

                const row = new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`giveaway_${giveaway.giveawayID}`)
                    .setLabel(`Participate`)
                    .setEmoji(`1065399898440208484`)
                    .setDisabled(true)
                    .setStyle(Discord.ButtonStyle.Secondary),
                    new Discord.ButtonBuilder()
                    .setCustomId(`participants_${giveaway.giveawayID}`)
                    .setLabel(`Participants`)
                    .setStyle(Discord.ButtonStyle.Secondary),
                )

                message.edit({ content: `:tada: GIVEAWAY ENDED :tada:`, components: [row] })

                        }
                    }
                }
            }
        })
        }, 10000)
        }
}

export default event;