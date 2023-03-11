import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder, CommandInteraction, SlashCommandSubcommandBuilder, ChatInputCommandInteraction, ButtonBuilder, MessageEvent, ButtonInteraction, Message, StringSelectMenuBuilder } from "discord.js"
import Discord from "discord.js";
import { SlashCommand } from "../types";
import settingsModule from "../schemas/Settings";

const command: SlashCommand = {
    cooldown: 10,
    command: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Use the setup sub commands")
    /*.addSubcommand((subcommand) =>
        subcommand.setName('language')
        .setDescription('Setup the language system')
        .addStringOption(option =>
            option.setName('lang')
            .setRequired(true)
            .setDescription('What language to setup')
            .addChoices(
                { name: `Chinese`, value: `chinese simplified` },
                { name: `Spanish`, value: `spanish` },
                { name: `English`, value: `english` },
                { name: `Hindi`, value: `hindi` },
                { name: `Arabic`, value: `arabic` },
                { name: `Portuguese`, value: `portuguese` },
                { name: `Bengali`, value: `bengali` },
                { name: `Russian`, value: `russian` },
                { name: `Japanese`, value: `japanese` },
                { name: `Punjabi`, value: `punjabi` },
                { name: `German`, value: `german` },
                { name: `Javanese`, value: `javanese` },
                { name: `Wu (including Shanghainese)`, value: `wu` },
                { name: `Korean`, value: `korean` },
                { name: `French`, value: `french` },
                { name: `Telugu`, value: `telugu` },
                { name: `Marathi`, value: `marathi` },
                { name: `Tamil`, value: `tamil` },
                { name: `Turkish`, value: `turkish` },
                { name: `Vietnamese`, value: `vietnamese` },
                { name: `Urdu`, value: `urdu` },
                { name: `Cantonese`, value: `cantonese` },
                { name: `Persian`, value: `persian` },
                { name: `Pashto`, value: `pashto` },
                { name: `Polish`, value: `polish` }
            )
        )
            
    )*/
    .addSubcommand((subcommand) =>
        subcommand.setName('sticky')
        .setDescription('Setup the sticky message system')
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('reactionroles')
        .setDescription('Setup the reaction roles system')
        .addStringOption(option =>
            option.setName('type')
            .setRequired(true)
            .setDescription('What type of reaction role to setup')
            .addChoices(
                { name: `Button (mx 5)`, value: `button` },
                { name: `Dropdown (ms 25)`, value: `dropdown` }
            )
        )
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('audit')
        .setDescription('Setup the audit system')
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('welcome')
        .setDescription('Setup the welcome system')
    ),
    

    execute: async (interaction) => {
        if(!(interaction.member.permissions as any).has('ADMINISTRATOR')) return interaction.reply({ content: `You need to have the \`ADMINISTRATOR\` permission to use this command`, ephemeral: true })

        
        if((interaction.options as any).getSubcommand() == 'sticky') {
            await interaction.deferReply({ ephemeral: true });

            const data = await settingsModule.findOne({ guildID: interaction.guild.id })

            const row = new Discord.ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('setup-sticky')
                .setLabel('Add sticky')
                .setStyle(Discord.ButtonStyle.Primary),
                new Discord.ButtonBuilder()
                .setCustomId('setup-sticky-remove')
                .setLabel('Remove sticky')
                .setStyle(Discord.ButtonStyle.Danger)
            )

            if(!data?.sticky_messages){
                row.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('setup-sticky-edit')
                    .setLabel('Edit sticky')
                    .setStyle(Discord.ButtonStyle.Success)
                    .setDisabled(true)
                )
            } else {
                row.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('setup-sticky-edit')
                    .setLabel('Edit sticky')
                    .setStyle(Discord.ButtonStyle.Success)
                )
            }

            await interaction.editReply({ content: `Setup the **${(interaction.options as any).getSubcommand()}** system by navigating buttons below!`, components: [row] })
        }


        if((interaction.options as any).getSubcommand() == 'welcome') {
            await interaction.deferReply({ ephemeral: true });

            const data5 = await settingsModule.findOne({ guildID: interaction.guild.id })

            const row = new Discord.ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('setup-welcome')
                .setLabel('Add welcome')
                .setStyle(Discord.ButtonStyle.Primary)
            )

            if(!data5?.welcome || data5?.welcome.length <= 0){
                row.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('setup-welcome-remove')
                    .setLabel('Remove welcome')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setDisabled(true),
                    new Discord.ButtonBuilder()
                    .setCustomId('setup-welcome-edit')
                    .setLabel('Edit welcome')
                    .setStyle(Discord.ButtonStyle.Success)
                    .setDisabled(true)
                )
            } else {
                row.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('setup-welcome-remove')
                    .setLabel('Remove welcome')
                    .setStyle(Discord.ButtonStyle.Danger),
                    new Discord.ButtonBuilder()
                    .setCustomId('setup-welcome-edit')
                    .setLabel('Edit welcome')
                    .setStyle(Discord.ButtonStyle.Success)
                )
            }

            await interaction.editReply({ content: `Setup the **${(interaction.options as any).getSubcommand()}** system by navigating buttons below!`, components: [row] })
        }
        if((interaction.options as any).getSubcommand() == 'audit') {
            await interaction.deferReply({ ephemeral: true });

            const data5 = await settingsModule.findOne({ guildID: interaction.guild.id })

            const row = new Discord.ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('setup-audit')
                .setLabel('Add audit')
                .setStyle(Discord.ButtonStyle.Primary)
            )

            if(!data5?.welcome || data5?.welcome.length <= 0){
                row.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('setup-audit-remove')
                    .setLabel('Remove audit')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setDisabled(true),
                )
            } else {
                row.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('setup-audit-remove')
                    .setLabel('Remove audit')
                    .setStyle(Discord.ButtonStyle.Danger),
                )
            }

            await interaction.editReply({ content: `Setup the **${(interaction.options as any).getSubcommand()}** system by navigating buttons below!`, components: [row] })
        }
        if((interaction.options as any).getSubcommand() == 'reactionroles') {
            const type = (interaction.options as any).getString('type')

            if(type == 'button') {
            await interaction.deferReply({ ephemeral: true });
            const row = new Discord.ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('add-reactionroles')
                .setLabel('Add role')
                .setStyle(Discord.ButtonStyle.Primary),
                new Discord.ButtonBuilder()
                .setCustomId('view-reactionroles')
                .setLabel('View roles')
                .setStyle(Discord.ButtonStyle.Secondary),
                new Discord.ButtonBuilder()
                .setCustomId('send-reactionroles')
                .setLabel('Send roles')
                .setStyle(Discord.ButtonStyle.Success),
            )

            const back = new Discord.ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('back-reactionroles')
                .setLabel('Back')
                .setStyle(Discord.ButtonStyle.Primary)
            )

            const btnMsg = await interaction.editReply({ content: `Setup the **${(interaction.options as any).getSubcommand()}** system by navigating buttons below!`, components: [row] })

            const filter = (i: any) => i.customId.startsWith('add-reactionroles') || i.customId.startsWith('view-reactionroles') || i.customId.startsWith('send-reactionroles') || i.customId.startsWith('back-reactionroles') && i.user.id === interaction.user.id;
            const collector = (interaction.channel as any).createMessageComponentCollector({ filter, time: 1200000 });

            const buttons = [] as any;
            collector.on('collect', async (i: any) => {
                if(i.customId == 'back-reactionroles') {
                    await interaction.editReply({ content: `Setup the **${(interaction.options as any).getSubcommand()}** system by navigating buttons below!`, components: [row] })
                }
                if(i.customId == 'add-reactionroles') {
                    if(buttons.length >= 5) {
                        await interaction.editReply({ content: `You can't add more than 5 buttons! Make a new reactionrole message to do so!`, components: [row] })
                        return
                    }
                    await interaction.editReply({ content: `What role to add? Mention it`, components: [] })
                    const role2 = await interaction.client.awaitRoleReply(i, interaction)
                    if(!role2) {
                        await interaction.editReply({ content: `You didn't mention a role!`, components: [row] })
                        return
                    }
                    await interaction.editReply({ content: `What emoji to add?`, components: [] })
                    const emoji2 = await interaction.client.awaitEmojiReply(i, interaction)
                    if(!emoji2) {
                        await interaction.editReply({ content: `You didn't mention a emoji!`, components: [row] })
                        return
                    }

                        const btn = new Discord.ButtonBuilder()
                        .setCustomId('rrole_' + role2.id)
                        .setLabel(role2.name)
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setEmoji(emoji2)
                    
                        buttons.push(btn)
                        await interaction.editReply({ content: `Added role **${role2.name}** with emoji **${emoji2}**!`, components: [row] })

                }
                if(i.customId == 'view-reactionroles') {
                    if(buttons.length <= 0) {
                        await interaction.editReply({ content: `There are no roles!`, components: [row] })
                        return
                    }
                    await interaction.editReply({ content: `Here are all the roles!`, components: [new Discord.ActionRowBuilder<ButtonBuilder>().addComponents(buttons), back] })
                }
                if(i.customId == 'send-reactionroles') {
                    await interaction.editReply({ content: `What message to send?`, components: [] })
                    const msg2 = await interaction.client.awaitReply(i, interaction)
                    if(!msg2) {
                        await interaction.editReply({ content: `You didn't mention a message!`, components: [row] })
                        return
                    }
                    // ask for a channel
                    await interaction.editReply({ content: `What channel to send?`, components: [] })
                    const channel2 = await interaction.client.awaitChannelReply(i, interaction)
                    if(!channel2) {
                        await interaction.editReply({ content: `You didn't mention a channel!`, components: [row] })
                        return
                    }
                    // send the message
                    const msg3 = await (channel2 as any).send({ content: msg2, components: [new Discord.ActionRowBuilder<ButtonBuilder>().addComponents(buttons)] })
                    await interaction.editReply({ content: `Sent the reactionrole message in ${channel2}!`, components: [] })

                    collector.stop()
                }
            })

            collector.on('end', async (i: any, reason: any) => {
                if(reason == 'time') {
                await interaction.editReply({ content: `Setup the **${(interaction.options as any).getSubcommand()}** system by navigating buttons below!\n• Time ran out, please try again!`, components: [] })
                } 
            })
        } else {
            await interaction.deferReply({ ephemeral: true });
            const row = new Discord.ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('add-reactionroles')
                .setLabel('Add role')
                .setStyle(Discord.ButtonStyle.Primary),
                new Discord.ButtonBuilder()
                .setCustomId('view-reactionroles')
                .setLabel('View roles')
                .setStyle(Discord.ButtonStyle.Secondary),
                new Discord.ButtonBuilder()
                .setCustomId('send-reactionroles')
                .setLabel('Send roles')
                .setStyle(Discord.ButtonStyle.Success),
            )

            const back = new Discord.ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('back-reactionroles')
                .setLabel('Back')
                .setStyle(Discord.ButtonStyle.Primary)
            )

            const btnMsg = await interaction.editReply({ content: `Setup the **${(interaction.options as any).getSubcommand()}** system by navigating buttons below!`, components: [row] })

            const filter = (i: any) => i.customId.startsWith('add-reactionroles') || i.customId.startsWith('view-reactionroles') || i.customId.startsWith('send-reactionroles') || i.customId.startsWith('back-reactionroles') && i.user.id === interaction.user.id;
            const collector = (interaction.channel as any).createMessageComponentCollector({ filter, time: 1200000 });

            const buttons = [] as any;
            collector.on('collect', async (i: any) => {
                if(i.customId == 'back-reactionroles') {
                    await interaction.editReply({ content: `Setup the **${(interaction.options as any).getSubcommand()}** system by navigating buttons below!`, components: [row] })
                }
                if(i.customId == 'add-reactionroles') {
                    if(buttons.length >= 5) {
                        await interaction.editReply({ content: `You can't add more than 5 buttons! Make a new reactionrole message to do so!`, components: [row] })
                        return
                    }
                    await interaction.editReply({ content: `What role to add? Mention it`, components: [] })
                    const role2 = await interaction.client.awaitRoleReply(i, interaction)
                    if(!role2) {
                        await interaction.editReply({ content: `You didn't mention a role!`, components: [row] })
                        return
                    }
                    await interaction.editReply({ content: `What emoji to add?`, components: [] })
                    const emoji2 = await interaction.client.awaitEmojiReply(i, interaction)
                    if(!emoji2) {
                        await interaction.editReply({ content: `You didn't mention a emoji!`, components: [row] })
                        return
                    }
                    
                        buttons.push({
                            label: role2.name,
                            value: role2.id,
                            emoji: emoji2
                        })

                        await interaction.editReply({ content: `Added role **${role2.name}** with emoji **${emoji2}**!`, components: [row] })

                }
                if(i.customId == 'view-reactionroles') {
                    if(buttons.length <= 0) {
                        await interaction.editReply({ content: `There are no roles!`, components: [row] })
                        return
                    }
                    
                    await interaction.editReply({ content: `Here are all the roles!`, components: [new Discord.ActionRowBuilder<StringSelectMenuBuilder>()
                        .addComponents(
                            new Discord.StringSelectMenuBuilder()
                            .setCustomId('view-reactionroles2')
                            .setPlaceholder('Select a role')
                            .addOptions(buttons)
                        ), back] })
                }
                if(i.customId == 'send-reactionroles') {
                    await interaction.editReply({ content: `What message to send?`, components: [] })
                    const msg2 = await interaction.client.awaitReply(i, interaction)
                    if(!msg2) {
                        await interaction.editReply({ content: `You didn't mention a message!`, components: [row] })
                        return
                    }
                    // ask for a channel
                    await interaction.editReply({ content: `What channel to send?`, components: [] })
                    const channel2 = await interaction.client.awaitChannelReply(i, interaction)
                    if(!channel2) {
                        await interaction.editReply({ content: `You didn't mention a channel!`, components: [row] })
                        return
                    }
                    // send the message
                    const msg3 = await (channel2 as any).send({ content: msg2, components: [new Discord.ActionRowBuilder<StringSelectMenuBuilder>()
                        .addComponents(
                            new Discord.StringSelectMenuBuilder()
                            .setCustomId('view-reactionroles2')
                            .setPlaceholder('Select a role')
                            .addOptions(buttons)
                        )] })
                    await interaction.editReply({ content: `Sent the reactionrole message in ${channel2}!`, components: [] })

                    collector.stop()
                }
            })

            collector.on('end', async (i: any, reason: any) => {
                if(reason == 'time') {
                await interaction.editReply({ content: `Setup the **${(interaction.options as any).getSubcommand()}** system by navigating buttons below!\n• Time ran out, please try again!`, components: [] })
                } 
            })
        }
        }
    }
}

export default command