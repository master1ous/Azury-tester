import { Interaction, Message, ActionRowBuilder, ModalActionRowComponentBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, TextChannel, ButtonBuilder, ButtonStyle, ThreadChannel, ChannelType, DiscordAPIError } from "discord.js";
import { BotEvent } from "../types";
import Discord from "discord.js";
import discordTranscripts from "discord-html-transcripts";
import { ExportReturnType } from "discord-html-transcripts/dist/types";
import moment from "moment";
import fs from "fs";
import settingsModule from "../schemas/Settings";
import giveawayModule from "../schemas/Giveaway";
import { threadId } from "worker_threads";

const event : BotEvent = {
    name: "interactionCreate",
    execute: async(interaction: Interaction) => {
        if(interaction.isModalSubmit()) {
            if(interaction.customId == 'code_support_modal') {
                await interaction.deferReply({ ephemeral: true});
                const text = interaction.fields.getTextInputValue('code_support_text');
                const image = interaction.fields.getTextInputValue('code_support_image');
                const thread = await (interaction.channel as any).threads.create({
                    name: `code・${interaction.user.id}`,
                    autoArchiveDuration: 1440,
                    type: ChannelType.GuildPublicThread,
                    reason: 'Code Support',
                })

                await thread.members.add(interaction.user.id);

                await thread.send({ content: `**Code Support for ${interaction.user.toString()}** _(<@&1082716973231788155>)_\n\n${text}${image ? `\n`+image : ' '}`, components: [] })
                await interaction.editReply({ content: await interaction.client.translate(`Thread created at <#`)+thread+`>`, components: [] });
                setTimeout(async() => {
                await (interaction.channel as any).bulkDelete(1);
                }, 3000)
            }
        }
         if (interaction.isButton()) {
            // CODE SUPPORT
            if(interaction.customId == 'code_supports') {
                const threadExists = (interaction.channel as any).threads.cache.find((t: ThreadChannel) => t.name == `code・${interaction.user.id}`);
                if(threadExists) return interaction.reply({ content: `You already have a thread open!`, ephemeral: true });

                // show a modal
                const modal = new ModalBuilder()
                .setTitle('Code Support')
                .setCustomId('code_support_modal')
                .addComponents(
                    new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                    new TextInputBuilder()
                    .setPlaceholder('Enter your issue here...')
                    .setStyle(TextInputStyle.Paragraph)
                    .setMinLength(10)
                    .setMaxLength(1000)
                    .setCustomId('code_support_text')
                    .setRequired(true)
                    .setLabel('Issue (*)')
                    ),
                    new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                    new TextInputBuilder()
                    .setPlaceholder('Enter image here...')
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(10)
                    .setMaxLength(1000)
                    .setCustomId('code_support_image')
                    .setRequired(false)
                    .setLabel('Image')
                    ),
                )
                
                await interaction.showModal(modal);
            }
            
            // DEV ONLY STUFF
            if(interaction.customId == 'staff_close') {
                await interaction.deferReply();
                const role = interaction.guild.roles.cache.get('1053299948420079616')
                if(!interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role.id)) return;

                const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents([
                    new ButtonBuilder()
                    .setCustomId('staff_delete')
                    .setLabel('Delete')
                    .setStyle(ButtonStyle.Danger)
                ])

                await interaction.editReply({ content: await interaction.client.translate(`Thread closed!`), components: [row] });

                const thread = await (interaction.channel as any).fetch()
                await thread.setLocked(true)
                await thread.members.add('693553429380857978'); await thread.members.add('1078770321240375347'); await thread.members.add('705048027865415690'); 

                (interaction.client.channels.cache.get('1056689350231982092') as TextChannel).send({ content: `🔒 **Thread closed | ${interaction.channel.name}**\n\n${interaction.user.toString()} has closed a thread in ${interaction.guild.name} (${interaction.guild.id})` })
            }
            if(interaction.customId == 'staff_delete') {
                await interaction.deferUpdate();
                const role = interaction.guild.roles.cache.get('1053299948420079616')
                if(!interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role.id)) return;

                

                // make a custom discord html transcript
                const thread = await (interaction.channel as any).fetch()
                const transcript = await discordTranscripts.createTranscript(thread, {
                    returnType: ExportReturnType.Attachment,
                    filename: `transcript-${thread.name}.html`,
                    poweredBy: false,
                });

                
                (interaction.client.channels.cache.get('1056689350231982092') as TextChannel).send({ content: `🗑️ **Thread deleted | ${interaction.channel.name}**\n\n${interaction.user.toString()} has deleted a thread in ${interaction.guild.name} (${interaction.guild.id})`, files: [transcript] })
                await thread.delete();
                }

        }
        if(interaction.isSelectMenu()) {
            if(interaction.customId == "staff_support") {
                if(interaction.values[0] == "staff_support_1") {
                    await interaction.deferReply({ ephemeral: true});
                    await interaction.editReply({ content: `To get started being staff, make sure to check <#1053287227570012160>, be active in tickets, and support members as much as you can!\n• We also sometimes give weekly requirements to accomplish as staff at Azury!`, components: [] })
                }
                if(interaction.values[0] == "staff_support_3") {
                    await interaction.deferReply({ ephemeral: true});
                    await interaction.editReply({ content: `Here at Azury we don't do "**promotions**" we do Jobs, want to be a higher ranking job or do something different at Azury? You gotta apply for that!\n• Note that each application is different and it's difficulties may vary depending on the job chosen`, components: [] })
                }
                if(interaction.values[0] == "staff_support_4") {
                    await interaction.deferReply({ ephemeral: true});
                    await interaction.editReply({ content: `At Azury, you aren't so likely to get fired unless you have been inactive without giving a reason of leave, like, sick, away, vacation, ect.`, components: [] })
                }
                if(interaction.values[0] == "staff_support_5") {
                    await interaction.deferReply({ ephemeral: true});
                    await interaction.editReply({ content: await interaction.client.translate(`Please wait...`), components: [] })
                    const thread = await (interaction.channel as any).threads.create({
                        name: `staff・${interaction.user.id}`,
                        autoArchiveDuration: 1440,
                        type: ChannelType.GuildPrivateThread,
                        reason: 'Staff Support',
                    })

                    const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents([
                        new ButtonBuilder()
                        .setCustomId('staff_close')
                        .setLabel('Close thread')
                        .setStyle(ButtonStyle.Danger)
                    ])

                    await thread.members.add(interaction.user.id);

                    await thread.send({ content: `🎫 **Staff Support**\n\n${interaction.user.toString()} has created a private thread for staff support! (<@&1053299948420079616>)`, components: [row] })
                    await interaction.editReply({ content: await interaction.client.translate(`Thread created at: <#`)+thread+`>`, components: [] })
                }
            }
        }
    }
}

export default event;