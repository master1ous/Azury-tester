import { Interaction, Message, ActionRowBuilder, ModalActionRowComponentBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, TextChannel, ButtonBuilder, ButtonStyle, ThreadChannel, ChannelType } from "discord.js";
import { BotEvent } from "../types";

import settingsModule from "../schemas/Settings";
import giveawayModule from "../schemas/Giveaway";
import reminderModule from "../schemas/Reminder";
import { threadId } from "worker_threads";

const event : BotEvent = {
    name: "interactionCreate",
    execute: async(interaction: Interaction) => {
        
        if (interaction.isChatInputCommand()) {
            let command = interaction.client.slashCommands.get(interaction.commandName)
            let cooldown = interaction.client.cooldowns.get(`${interaction.commandName}-${interaction.user.username}`)
            if (!command) return;
            if (command.cooldown && cooldown) {
                if (Date.now() < cooldown) {
                    interaction.reply({ content: `You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this command again.`, ephemeral: true })
                    
                    return
                }
                interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000)
                setTimeout(() => {
                    interaction.client.cooldowns.delete(`${interaction.commandName}-${interaction.user.username}`)
                }, command.cooldown * 1000)
            } else if (command.cooldown && !cooldown) {
                interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000)
            }
            command.execute(interaction)
        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.slashCommands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                if(!command.autocomplete) return;
                command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            } 
        }
        
        // Settings Events, such as modals, buttons, selects, etc.
        if(interaction.isModalSubmit()) {

if(interaction.customId == "sticky-add"){
    const channel = interaction.fields.getTextInputValue('sticky-channel')
    const message = interaction.fields.getTextInputValue('sticky-msg')
    const btnHtp = interaction.fields.getTextInputValue('sticky-btnHtp')
    const btnLabel = interaction.fields.getTextInputValue('sticky-Label')
    const BtnEmoji = interaction.fields.getTextInputValue('sticky-BtnEmoji')

    const data = await settingsModule.findOne({ guildID: interaction.guild?.id})

if(data?.sticky_messages[0] && data?.sticky_messages[0].channel == channel) return interaction.reply({content: "This channel already has a sticky message!", ephemeral: true})


const datas = await settingsModule.findOne({ guildID: interaction.guild?.id})

if(btnHtp){
    if(!btnHtp.includes("https://")) return interaction.reply({content: "This Btn requires a https:// url!", ephemeral: true})
}



if(BtnEmoji){
    if(!BtnEmoji.includes("<"))  return interaction.reply({content: "Custom emojis are only supported!", ephemeral: true})
}




if(btnHtp && !btnLabel) return interaction.reply({content: "Please enter the label of the button to make one"})

if(btnLabel && !btnHtp) return interaction.reply({content: "Please enter the URL of the button"})




await interaction.reply({content: "Sticky System was successful! Check it out below", ephemeral: true})


if(!btnHtp && !btnLabel && !BtnEmoji){
    await interaction.channel.send({content: message}).then((msg) => {
        if(!data) { console.log('thisfar');new settingsModule({ guildID: interaction.guild?.id, sticky_messages: [{ "channel": channel, "content": message, "message": msg.id }] }).save() }
    else {
        settingsModule.findOneAndUpdate({ guildID: interaction.guild?.id, "sticky_messages.channel": channel }, { $set: { "sticky_messages.$.content": message } }, { new: true }).exec()
    }
    })
}

if(btnHtp && btnLabel && !BtnEmoji){
    await interaction.channel.send({content: message, components: [
        new ActionRowBuilder<ButtonBuilder>()
                    .addComponents([
                        new ButtonBuilder()
					.setLabel(`${btnLabel}`)
                    .setURL(`${btnHtp}`)
					.setStyle(ButtonStyle.Link),
                    ])
    ]}).then((msg) => {
        if(!data) new settingsModule({ guildID: interaction.guild?.id, sticky_messages: [{ "channel": channel, "content": message, "message": msg.id, "btnUrl": btnHtp, "btnLabel": btnLabel  }] }).save()
        else {
            settingsModule.findOneAndUpdate({ guildID: interaction.guild?.id, "sticky_messages.channel": channel }, { $set: { "sticky_messages.$.content": message, "sticky_messages.$.btnUrl": btnHtp, "sticky_messages.$.btnLabel": btnLabel } }, { new: true }).exec()
                
            }
    })
}

if(btnHtp && btnLabel && BtnEmoji){
    await interaction.channel.send({content: message, components: [
        new ActionRowBuilder<ButtonBuilder>()
                    .addComponents([
                        new ButtonBuilder()
					.setLabel(`${btnLabel}`)
                    .setEmoji(`${BtnEmoji}`)
                    .setURL(`${btnHtp}`)
					.setStyle(ButtonStyle.Link),
                    ])
    ]}).then((msg) => {
        if(!data) new settingsModule({ guildID: interaction.guild?.id, sticky_messages: [{ "channel": channel, "content": message, "message": msg.id, "btnUrl": btnHtp, "btnLabel": btnLabel,"btnEmoji": BtnEmoji   }] }).save()
        else {
            settingsModule.findOneAndUpdate({ guildID: interaction.guild?.id, "sticky_messages.channel": channel }, { $set: { "sticky_messages.$.content": message, "sticky_messages.$.btnUrl": btnHtp, "sticky_messages.$.btnLabel": btnLabel, "sticky_messages.$.btnEmoji": BtnEmoji } }, { new: true }).exec()
            
        }
    })
}





}


            if(interaction.customId == 'welcome-edit'){
                const channel = interaction.fields.getTextInputValue('welcome-channel')
                const message = interaction.fields.getTextInputValue('welcome-msg')

                const data = await settingsModule.findOne({ guildID: interaction.guild?.id })
                if(!data) return interaction.reply({ content: await interaction.client.translate(`No data exists for that channel id!`, interaction.guild?.id), ephemeral: true })
                else {
                    settingsModule.findOneAndUpdate({ guildID: interaction.guild?.id, "welcome.channel": channel }, { $set: { "welcome.$.message": message } }, { new: true }).exec()
                }

                await interaction.reply({ content: await interaction.client.translate(`Welcome message edited to ${message}`), ephemeral: true })
            }

            if(interaction.customId == 'sticky-edit'){
                const channel = interaction.fields.getTextInputValue('sticky-channel')
                const message = interaction.fields.getTextInputValue('sticky-msg')

                const data = await settingsModule.findOne({ guildID: interaction.guild?.id })
                if(!data) return interaction.followUp({ content: await interaction.client.translate(`No data exists for that channel id!`, interaction.guild?.id), ephemeral: true })
                else {
                    settingsModule.findOneAndUpdate({ guildID: interaction.guild?.id, "sticky_messages.channel": channel }, { $set: { "sticky_messages.$.content": message } }, { new: true }).exec()
                }

                await interaction.reply({ content: await interaction.client.translate(`Sticky message edited to ${message}`), ephemeral: true })
            }
            if(interaction.customId == "welcome-remove"){
                const channel = interaction.fields.getTextInputValue('welcome-channel')

                const data = await settingsModule.findOne({ guildID: interaction.guild?.id })

                if(!data || !data.welcome[0]) await interaction.followUp({ content: await interaction.client.translate(`Welcome system is not setup!`), components: [] })


                if(!channel === data.welcome[0].channel){
                    return interaction.followUp({ content: await interaction.client.translate(`Error: ID is not valid to any database!`), components: [] })
                }

                settingsModule.updateOne({ guildID: interaction.guild?.id }, { $pull: { welcome: { "channel": data.welcome[0].channel } } }).exec().catch(async (e) => {
                    interaction.followUp({content: await interaction.client.translate(`A error occured! Please contact Azury`)})
                    console.log(e)
                })

                interaction.followUp({ content: await interaction.client.translate(`Removal has been successful!`), components: [] })




 
            }
            if(interaction.customId == "sticky-remove"){
                await interaction.deferUpdate()

                const channel = interaction.fields.getTextInputValue('sticky-channel')

                const data = await settingsModule.findOne({ guildID: interaction.guild?.id })

                if(!data?.sticky_messages) await interaction.followUp({ content: await interaction.client.translate(`Sticky system is not setup!`), components: [] })


                if(!channel === data?.sticky_messages[0].channel){
                    await interaction.editReply({ content: await interaction.client.translate(`Error: ID is not valid to any database!`), components: [] })
                }

                settingsModule.updateOne({ guildID: interaction.guild?.id }, { $pull: { sticky_messages: { "channel": data?.sticky_messages[0].channel } } }).exec().catch(async (e) => {
                    await interaction.editReply({content: await interaction.client.translate(`A error occured! Please contact Azury`)})
                    console.log(e)
                })

                
                
               await interaction.editReply({ content: await interaction.client.translate(`Removal has been successful!`), components: [] })




 
            }
        }

        if(interaction.isStringSelectMenu()) {
            if(interaction.customId == 'view-reactionroles2') {
                const roleId = interaction.values as any;
                const role = interaction.guild?.roles.cache.get(roleId[0])
                if(!role) return interaction.reply({ content: `No role found with that id!`, ephemeral: true })

                await interaction.deferReply({ ephemeral: true})

                if(interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(roleId[0])) {
                    await interaction.guild.members.cache.get(interaction.user.id)?.roles.remove(role)
                    await interaction.editReply({ content: await interaction.client.translate(`Removed role ${role.toString()} from you!`), components: [] })
                } else {
                    await interaction.guild.members.cache.get(interaction.user.id)?.roles.add(role)
                    await interaction.editReply({ content: await interaction.client.translate(`Added role ${role.toString()} to you!`), components: [] })
                }
            }
        }

        if (interaction.isButton()) {
            if(interaction.customId.startsWith('rem_')) {
                await interaction.deferReply({ ephemeral: true})
                const remID = interaction.customId.replace('rem_', '')
                const data = await reminderModule.findOne({ reminderID: remID })
                if(!data) {
                    await interaction.editReply({ content: `Seems this reminder is nolonger valid or has been deleted!` });
                    return;
                }
                const dataAll = await reminderModule.find({ userID: interaction.user.id })
                if(dataAll.some((d) => d.reminder === data.reminder)) {
                    await interaction.editReply({ content: `You already have a reminder with the same message!` });
                    return;
                }

                const id = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)

                const reminderData = new reminderModule({
                    userID: interaction.user.id,
                    reminder: data.reminder,
                    reminderID: id,
                    time: data.time,
                    date: data.date,
                    createdAt: new Date(Date.now()).toLocaleString(),
                    channel: interaction.channel.id,
                    loop: false,
                }).save()

                await interaction.editReply({ content: `✅ You have subscribed to <@${data.userID}>'s reminder! To unsubscribe use </utility reminder delete:1085749943668592714> including the ID \`${id}\`` })
            }
            if(interaction.customId.startsWith('giveaway_')) {
                const id = interaction.customId.replace('giveaway_', '')

                const data = await giveawayModule.findOne({ giveawayID: id })
                if(!data) return interaction.reply({ content: await interaction.client.translate(`No giveaway found with that id!`), ephemeral: true })
                if(data.ended === true) return interaction.reply({ content: await interaction.client.translate(`This giveaway has already ended!`), ephemeral: true });

                if(data.participants.includes(interaction.user)) {
                    // remove the user from the participants array
                    giveawayModule.findOneAndUpdate({ giveawayID: id }, { $pull: { participants: interaction.user } }, { new: true }).exec()

                    await interaction.reply({ content: await interaction.client.translate(`You have been removed from the giveaway!`), ephemeral: true })
                } else {
                    // add the user to the participants array
                    giveawayModule.findOneAndUpdate({ giveawayID: id }, { $push: { participants: interaction.user } }, { new: true }).exec()

                    await interaction.reply({ content: await interaction.client.translate(`You have been added to the giveaway for **${data.prize}**`), ephemeral: true })
                }
            }
            if(interaction.customId.startsWith('participants_')) {
                const id = interaction.customId.replace('participants_', '')

                const data = await giveawayModule.findOne({ giveawayID: id })
                if(!data) return interaction.reply({ content: await interaction.client.translate(`No giveaway found with that id!`), ephemeral: true })

                if(data.participants.length < 1) return interaction.reply({ content: await interaction.client.translate(`No participants found in this giveaway!`), ephemeral: true })

                const participants = data.participants.map((p: any) => `<@${p}>`).join(', ')

                await interaction.reply({ content: await interaction.client.translate(`Participants: ${participants}`), ephemeral: true })
            }
            if(interaction.customId == 'setup-sticky') {
               
                const row = new ModalBuilder()
                .setTitle('Add a new sticky message')
                .setCustomId('sticky-add')
                .addComponents([
                    new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents([
                        new TextInputBuilder()
                        .setCustomId('sticky-channel')
                        .setMinLength(1)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setLabel(`Channel ID`)
                    ]),
                    new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents([
                        new TextInputBuilder()
                        .setCustomId('sticky-msg')
                        .setLabel('Message Text')
                        .setMinLength(1)
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                    ]),
                    new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents([
                        new TextInputBuilder()
                        .setCustomId('sticky-btnHtp')
                        .setLabel('Button URL')
                        .setMinLength(9)
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(false)
                    ]),
                    new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents([
                        new TextInputBuilder()
                        .setCustomId('sticky-Label')
                        .setLabel('Button Label')
                        .setMinLength(1)
                        .setMaxLength(80)
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(false)
                    ]),
                    new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents([
                        new TextInputBuilder()
                        .setCustomId('sticky-BtnEmoji')
                        .setLabel('Button Emoji')
                        .setMinLength(3)
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(false)
                    ]),
                ])
                    
                await interaction.showModal(row)




            } else if(interaction.customId == 'setup-sticky-edit') {
                const row = new ModalBuilder()
                .setTitle('Sticky message edit')
                .setCustomId('sticky-edit')
                .addComponents([
                    new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents([
                        new TextInputBuilder()
                        .setCustomId('sticky-channel')
                        .setMinLength(1)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setLabel(`Channel ID`)
                    ]),
                    new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents([
                        new TextInputBuilder()
                        .setCustomId('sticky-msg')
                        .setLabel('Message Text')
                        .setMinLength(1)
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                    ])
                ])
                    
                await interaction.showModal(row)
            } else if(interaction.customId == 'setup-welcome'){
                await interaction.deferUpdate();
                await interaction.followUp({ content: await interaction.client.translate(`Please enter the channel you want to set as sticky!`), components: [] })

                const filter = (m: Message) => m.author.id === interaction.user.id;
                const collector = (interaction.channel as any)?.createMessageCollector({ filter, time: 60000, max: 1 });

                collector?.on('collect', async (m: Message) => {
                    if(!m.mentions.channels.first()) {
                        await interaction.editReply({ content: await interaction.client.translate(`Please mention a channel in your message!`), components: [] })
                    } else { 
                        m.delete()
                        const collector2 = (m.channel as any)?.createMessageCollector({ filter, time: 60000, max: 1 });

                        await interaction.editReply({ content: await interaction.client.translate(`Welcome channel set to ${m.mentions.channels.first().toString()}, now what should be the welcome message?\n**Tip:** you can include variables such as {user.mention}, {user.tag}, {user.id}, ect (<https://pastebin.com/V5txVdPy>)`), components: [] })

                        collector2?.on('collect', async (m2: Message) => {
                            const data = await settingsModule.findOne({ guildID: interaction.guild.id })
                            m2.delete();

                            if(!data) new settingsModule({ guildID: interaction.guild?.id, welcome: [{ "channel": m.mentions.channels.first().id, "message": m2.content }] }).save()
                            else {
                                data.welcome.push({ "channel": m.mentions.channels.first().id, "message": m2.content })
                                data.save()
                            }

                            await interaction.editReply({ content: await interaction.client.translate(`Welcome message set to ${m2.content} in ${m.mentions.channels.first().toString()}`), components: [] })
                        })
                        collector2?.on('end', async (collected: any) => {
                            if(collected.size == 0) {
                                await interaction.editReply({ content: await interaction.client.translate(`You took too long to respond!`), components: [] })
                            }
                        })
                    }
                })
            } else if(interaction.customId == 'setup-welcome-remove') {
                const data = await settingsModule.findOne({ guildID: interaction.guild.id })

                if(!data || !data.welcome[0]) return interaction.editReply({ content: await interaction.client.translate(`Welcome system is not setup!`), components: [] })
                
                const row = new ModalBuilder()
                .setTitle('Remove Welcome!')
                .setCustomId('welcome-remove')
                .addComponents([
                    new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents([
                        new TextInputBuilder()
                        .setCustomId('welcome-channel')
                        .setMinLength(1)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setLabel(`Channel ID`)
                    ]),
                ])
                    
                await interaction.showModal(row)

            } 
            else if(interaction.customId == 'setup-sticky-remove') {
                const data = await settingsModule.findOne({ guildID: interaction.guild.id })

                if(!data?.sticky_messages) return interaction.channel.send({ content: await interaction.client.translate(`Welcome system is not setup!`), components: [] })
                
                const row = new ModalBuilder()
                .setTitle('Sticky Removal!')
                .setCustomId('sticky-remove')
                .addComponents([
                    new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents([
                        new TextInputBuilder()
                        .setCustomId('sticky-channel')
                        .setMinLength(1)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setLabel(`Channel ID`)
                    ]),
                ])
                    
                await interaction.showModal(row)

            }else if(interaction.customId == 'setup-welcome-edit') {
                const row = new ModalBuilder()
                .setTitle('Welcome message edit')
                .setCustomId('welcome-edit')
                .addComponents([
                    new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents([
                        new TextInputBuilder()
                        .setCustomId('welcome-channel')
                        .setMinLength(1)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setLabel(`Channel ID`)
                    ]),
                    new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents([
                        new TextInputBuilder()
                        .setCustomId('welcome-msg')
                        .setLabel('Message Text')
                        .setMinLength(1)
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                    ])
                ])
                    
                await interaction.showModal(row)
            } else if(interaction.customId == 'setup-audit'){
                await interaction.deferUpdate();
                await interaction.editReply({ content: await interaction.client.translate(`Please enter the channel you want to set as audit!`), components: [] })

                const filter = (m: Message) => m.author.id === interaction.user.id;
                const collector = (interaction.channel as any)?.createMessageCollector({ filter, time: 60000, max: 1 });

                collector?.on('collect', async (m: Message) => {
                    if(!m.mentions.channels.first()) {
                        await interaction.editReply({ content: await interaction.client.translate(`Please mention a channel in your message!`), components: [] })
                    } else { 
                    const data = await settingsModule.findOne({ guildID: interaction.guild.id })
                    m.delete();

                    if(!data) new settingsModule({ guildID: interaction.guild?.id, audit: [{ "channel": m.mentions.channels.first().id }] }).save()
                    else {
                        data.audit.push({ "channel": m.mentions.channels.first().id })
                        data.save()
                    }

                        await interaction.editReply({ content: await interaction.client.translate(`Audit channel set to ${m.mentions.channels.first().toString()}`), components: [] })

                    }
                })
            } else if(interaction.customId == 'setup-audit-remove') {
                const data = await settingsModule.findOne({ guildID: interaction.guild.id })

                if(!data || !data.audit[0]) await interaction.editReply({ content: await interaction.client.translate(`Audit system is not setup!`), components: [] })
                await interaction.editReply({ content: await interaction.client.translate(`Welcome system has been removed!`), components: [] })
                settingsModule.updateOne({ guildID: interaction.guild?.id }, { $pull: { welcome: { "channel": data.audit[0].channel } } }).exec()
            } else if(interaction.customId.startsWith('rrole_')) {
                await interaction.deferReply({ ephemeral: true });
                const roleId = interaction.customId.replace('rrole_', '')
                const role = interaction.guild?.roles.cache.get(roleId)
                if(!role) return await interaction.editReply({ content: await interaction.client.translate(`Role not found!`), components: [] })

                // check if the member has the role
                if(interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(roleId)) {
                    await interaction.guild.members.cache.get(interaction.user.id)?.roles.remove(role)
                    await interaction.editReply({ content: await interaction.client.translate(`Removed role ${role.toString()} from you!`), components: [] })
                } else {
                    await interaction.guild.members.cache.get(interaction.user.id)?.roles.add(role)
                    await interaction.editReply({ content: await interaction.client.translate(`Added role ${role.toString()} to you!`), components: [] })
                }
            }
        
        }
    }
}

export default event;
