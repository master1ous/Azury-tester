import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder, CommandInteraction, SlashCommandSubcommandBuilder, ChatInputCommandInteraction, ButtonBuilder, ModalActionRowComponentBuilder, Message, EmbedData } from "discord.js"
import Discord from "discord.js";
import { SlashCommand } from "../types";
import WarningsModel from "../schemas/Warnings";
import GiveawayModel from "../schemas/Giveaway";
import EmbedModel from "../schemas/EmbedBuilder";
import { PasteClient, Publicity, ExpireDate } from "pastebin-api";
import ms from "ms";
import { VariableDeclaration } from "typescript";

const command: SlashCommand = {
    cooldown: 10,
    command: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("Use the admin sub commands")
    /*.addSubcommand((subcommand) =>
        subcommand.setName('snipe')
        .setDescription('Snipe a message')
    )*/
    .addSubcommand((subcommand) =>
        subcommand.setName('embedbuilder')
        .setDescription('Create an embed')
        .addChannelOption(option =>
            option.setName('channel')
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildNews)
            .setRequired(true)
            .setDescription('Enter a channel to send the embed')
        )
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('snipe')
        .setDescription('Snipe a message')
        .addIntegerOption(option =>
            option.setName('msg')
            .setRequired(false)
            .setDescription('Enter a message to snipe')
        )
        .addChannelOption(option =>
            option.setName('channel')
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildNews)
            .setRequired(false)
            .setDescription('Enter a channel to snipe a message')
        )
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('purge')
        .setDescription('Purge messages')
        .addIntegerOption(option =>
            option.setName('amount')
            .setRequired(true)
            .setDescription('Enter an amount of messages to purge')
        )
        .addChannelOption(option =>
            option.setName('channel')
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildNews)
            .setDescription('Which channel to purge in')
            .setRequired(false)
        )
    )
    .addSubcommandGroup((group) => 
        group.setName('user')
        .setDescription('Use the user sub commands')
        .addSubcommand((subcommand) =>
			subcommand.setName('ban')
			.setDescription('Ban a user from the server')
            .addUserOption(option =>
                option.setName('user')
                .setRequired(true)
                .setDescription('Enter a user to ban')
            )
            .addStringOption(option =>
                option.setName('reason')
                .setRequired(false)
                .setDescription('Enter a reason for the ban')
            )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('kick')
            .setDescription('Kick a user from the server')
            .addUserOption(option =>
                option.setName('user')
                .setRequired(true)
                .setDescription('Enter a user to kick')
            )
            .addStringOption(option =>
                option.setName('reason')
                .setRequired(false)
                .setDescription('Enter a reason for the ban')
            )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('warn')
            .setDescription('Warn a user in the server')
            .addUserOption(option =>
                option.setName('user')
                .setRequired(true)
                .setDescription('Enter a user to kick')
            )
            .addStringOption(option =>
                option.setName('reason')
                .setRequired(false)
                .setDescription('Enter a reason for the warn')
            )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('warnings')
            .setDescription('Get a list of warnings for a user')
            .addUserOption(option =>
                option.setName('user')
                .setRequired(true)
                .setDescription('Enter a user to get warnings for')
            )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('unwarn')
            .setDescription('Unwarn a user in the server')
            .addUserOption(option =>
                option.setName('user')
                .setRequired(true)
                .setDescription('Enter a user to kick')
            )
            .addIntegerOption(option =>
                option.setName('warning')
                .setRequired(true)
                .setDescription('Enter a warning to remove')
            )
        )
    )
    .addSubcommandGroup((group) =>
        group.setName('giveaway')
        .setDescription('Use the giveaway sub commands')
        .addSubcommand((subcommand) =>
            subcommand.setName('create')
            .setDescription('Create a giveaway')
            .addChannelOption(option =>
                option.setName('channel')
                .setRequired(true)
                .setDescription('Enter a channel for the giveaway')
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildNews)
            )
            .addStringOption(option =>
                option.setName('description')
                .setRequired(true)
                .setDescription('Enter a description for the giveaway')
            )
            .addStringOption(option =>
                option.setName('prize')
                .setRequired(true)
                .setDescription('Enter a prize for the giveaway')
            )
            .addStringOption(option =>
                option.setName('time')
                .setRequired(true)
                .setDescription('Enter a time for the giveaway')
            )
            
            .addIntegerOption(option =>
                option.setName('winners')
                .setRequired(true)
                .setDescription('Enter a number of winners for the giveaway')
            )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('edit')
            .setDescription('Edit a giveaway')
            .addStringOption(option =>
                option.setName('giveaway')
                .setRequired(true)
                .setDescription('Enter a giveaway to edit')
            )
            .addStringOption(option =>
                option.setName('description')
                .setRequired(false)
                .setDescription('Enter a description for the giveaway')
            )
            .addStringOption(option =>
                option.setName('prize')
                .setRequired(false)
                .setDescription('Enter a prize for the giveaway')
            )
            .addStringOption(option =>
                option.setName('time')
                .setRequired(false)
                .setDescription('Enter a time for the giveaway')
            )
            .addIntegerOption(option =>
                option.setName('winners')
                .setRequired(false)
                .setDescription('Enter a number of winners for the giveaway')
            )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('end')
            .setDescription('End a giveaway')
            .addStringOption(option =>
                option.setName('giveaway')
                .setRequired(true)
                .setDescription('Enter a giveawayId to end')
            )
        )
    ),
    execute: async (interaction) => {
const client = require('../index')

        if (!(interaction.member as any).permissions.has('ADMINISTRATOR')) {
            return await interaction.reply({ content: 'You do not have permission to use this command', ephemeral: true })
        }

        if ((interaction.options as any).getSubcommand() == 'snipe') {
            await interaction.deferReply({ ephemeral: false })
            const channel = (interaction.options as any).getChannel('channel') || interaction.channel
            const msg = (interaction.options as any).getInteger('msg') || 1;

            const snipes = client.snipe.get(channel.id) || []
            const snipedmsg = snipes[msg - 1 || 0]

            if (!snipedmsg) return await interaction.editReply({ content: 'There are no messages to snipe' })

            const text = channel ? `Sniped message from **${snipedmsg.author.username}** in **this channel**` : `Sniped message from **${snipedmsg.author.username}** in **${channel.name}**`;

            let images = [] as any;

            const embed = new Discord.EmbedBuilder()
            .setAuthor({ name: snipedmsg.author.tag, iconURL: snipedmsg.author.displayAvatarURL() })
            .setDescription(snipedmsg.content)
            .setFooter({ text: `${msg || 1}/${snipes.length} snipes available - ${snipedmsg.author.id}` })
            .setColor(await client.embedColor(snipedmsg.author||interaction.user))

            if(snipedmsg.image && snipedmsg.image.length > 0) {
                snipedmsg.image.forEach((image: any) => {
                    images.push(`**[\`Click here for image\`](${image})**`)
                })
                embed.addFields(
                    { name: 'User attatchments', value: `${images.join(', ')}` },
                )
            }

            embed.addFields(
                { name: 'Message deletion date', value: `<t:${Math.floor(snipedmsg.timestamp/1000)}:R> (<t:${Math.floor(snipedmsg.timestamp/1000)}:F>)` },
            )

            await interaction.editReply({ content: `${text}`, embeds: [embed] })
        }
        if ((interaction.options as any).getSubcommand() == 'embedbuilder') {
                await interaction.deferReply({ ephemeral: true })
                const channel = (interaction.options as any).getChannel('channel') as TextChannel

                let msgsing = null as any;

                let embed = new Discord.EmbedBuilder()
                .setTitle('⚙️ Embed builder v1.1')
                .setColor(await client.embedColor(interaction.user))

                const row_back = new Discord.ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('back')
                    .setLabel('Back home')
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setEmoji('⬅️'),
                )

                const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('title')
                    .setLabel('Title')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('📝'),
                    new Discord.ButtonBuilder()
                    .setCustomId('description')
                    .setLabel('Description')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('📝'),
                    new Discord.ButtonBuilder()
                    .setCustomId('color')
                    .setLabel('Color')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🎨'),
                    new Discord.ButtonBuilder()
                    .setCustomId('footer')
                    .setLabel('Footer')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('📝'),
                    new Discord.ButtonBuilder()
                    .setCustomId('author')
                    .setLabel('Author')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('📝'),
                )
                const row2 = new Discord.ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('image')
                    .setLabel('Image')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🖼️'),
                    new Discord.ButtonBuilder()
                    .setCustomId('thumbnail')
                    .setLabel('Thumbnail')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🖼️'),
                    new Discord.ButtonBuilder()
                    .setCustomId('content')
                    .setLabel('Content')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('💬'),
                    new Discord.ButtonBuilder()
                    .setCustomId('field')
                    .setLabel('Add Field')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('➕'),
                )
                const row3 = new Discord.ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('clear_fields')
                    .setLabel('Field')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji('🗑️'),
                    new Discord.ButtonBuilder()
                    .setCustomId('clear_author')
                    .setLabel('Author')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji('🗑️'),
                    new Discord.ButtonBuilder()
                    .setCustomId('clear_description')
                    .setLabel('Description')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji('🗑️'),
                    new Discord.ButtonBuilder()
                    .setCustomId('clear_image')
                    .setLabel('Image')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji('🗑️'),
                    new Discord.ButtonBuilder()
                    .setCustomId('clear_thumbnail')
                    .setLabel('Thumbnail')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji('🗑️'),
                )
                const row4 = new Discord.ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('clear_footer')
                    .setLabel('Footer')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji('🗑️'),
                    new Discord.ButtonBuilder()
                    .setCustomId('clear_title')
                    .setLabel('Title')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji('🗑️'),
                    new Discord.ButtonBuilder()
                    .setCustomId('clear_content')
                    .setLabel('Content')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji('🗑️'),
                )

                const row_advanced = new Discord.ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('save')
                    .setLabel('Save copy')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('💾'),
                    new Discord.ButtonBuilder()
                    .setCustomId('load')
                    .setLabel('Load copy')
                    .setStyle(Discord.ButtonStyle.Success)
                    .setEmoji('📥'),
                    new Discord.ButtonBuilder()
                    .setCustomId('delete')
                    .setLabel('Delete copy')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setEmoji('🗑️'),
                )

                const row_advanced2 = new Discord.ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('view')
                    .setLabel('View your saved embeds')
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setEmoji('📜'),
                )

                const actionRow = new Discord.ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('edit')
                    .setLabel('Edit')
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setEmoji('✏️'),
                    new Discord.ButtonBuilder()
                    .setCustomId('clear')
                    .setLabel('Clear')
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setEmoji('🗑️'),
                    new Discord.ButtonBuilder()
                    .setCustomId('advanced')
                    .setLabel('Advanced')
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setEmoji('🔧'),
                    
                )
                const actionRow2 = new Discord.ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('send')
                    .setLabel(`Send to #${channel.name}`)
                    .setStyle(Discord.ButtonStyle.Success)
                    .setEmoji('📨'),
                )

                const btnMsg = await interaction.editReply({ embeds: [embed], components: [actionRow, actionRow2] })

                const filter = (i: any) => i.user.id === interaction.user.id
                const collector = btnMsg.createMessageComponentCollector({ filter, time: 1800000 })

                collector.on('collect', async (i: any) => {
                    if (i.customId == 'back') {
                        await i.update({ embeds: [embed], components: [actionRow, actionRow2] })
                    }
                    if (i.customId == 'advanced') {
                        await i.update({ embeds: [embed], components: [row_back, row_advanced, row_advanced2] })
                    }

                    if (i.customId == 'view') {
                        const data = await EmbedModel.find({ ownerID: interaction.user.id }) as any;
                        if (data.length < 1) return i.reply({ content: 'You have no saved embeds', ephemeral: true })
                        const embeds = data.map((d: any, i: any) => {
                            return `**${i + 1}**. **ID:** ${d.embedID}`
                        })

                        // if the embeds is too long, split into multiple pages
                        if (embeds.length > 10) {
                            let pages = [] as any;
                            let page = 1;
                            let pageContent = '';
                            for (const embed of embeds) {
                                if (pageContent.length + embed.length > 1024) {
                                    pages.push(pageContent);
                                    pageContent = '';
                                    page++;
                                }
                                pageContent += `${embed} \n`;
                            } 
                            if (pageContent) {
                                pages.push(pageContent);

                            let currentPage = 0;
                            const embed2 = new Discord.EmbedBuilder()
                            .setTitle(`Your saved embeds`)
                            .setDescription(pages[currentPage])
                            .setColor(await interaction.client.embedColor(interaction.user))
                            .setFooter({ text: `Page ${currentPage + 1} of ${pages.length}` })

                            const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new Discord.ButtonBuilder()
                                .setCustomId('previous')
                                .setLabel('Previous')
                                .setStyle(Discord.ButtonStyle.Secondary)
                                .setEmoji('⬅️'),
                                new Discord.ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('Next')
                                .setStyle(Discord.ButtonStyle.Secondary)
                                .setEmoji('➡️'),
                            )

                            const msg = await i.reply({ embeds: [embed2], components: [row], ephemeral: true })

                            const filter = (i: any) => i.user.id === interaction.user.id
                            const collector = msg.createMessageComponentCollector({ filter, time: 1800000 })

                            collector.on('collect', async (i: any) => {
                                if (i.customId == 'next') {
                                    if (currentPage < pages.length - 1) {
                                        currentPage++;
                                        embed2.setDescription(pages[currentPage])
                                        embed2.setFooter({ text: `Page ${currentPage + 1} of ${pages.length}` })
                                        await i.update({ embeds: [embed2] })
                                    }
                                }
                                if (i.customId == 'previous') {
                                    if (currentPage !== 0) {
                                        --currentPage;
                                        embed2.setDescription(pages[currentPage])
                                        embed2.setFooter({ text: `Page ${currentPage + 1} of ${pages.length}` })
                                        await i.update({ embeds: [embed2] })
                                    }
                                }
                            })

                            collector.on('end', async () => {
                                await msg.edit({ components: [] })
                            })
                            } else {
                                const embed2 = new Discord.EmbedBuilder()
                                .setTitle(`Your saved embeds`)
                                .setDescription(embeds.join('\n'))
                                .setColor(await interaction.client.embedColor(interaction.user))
                                .setFooter({ text: `Page 1 of 1` })
                                await i.reply({ embeds: [embed2], ephemeral: true })
                            }
                        } else {
                            const embed2 = new Discord.EmbedBuilder()
                            .setTitle(`Your saved embeds`)
                            .setDescription(embeds.join('\n'))
                            .setColor(await interaction.client.embedColor(interaction.user))
                            .setFooter({ text: `Page 1 of 1` })
                            await i.reply({ embeds: [embed2], ephemeral: true })
                        }

                    }
                    if (i.customId == 'delete') {
                        await i.deferUpdate();
                        await interaction.editReply(`Please enter the ID of the embed you want to delete`)
                        const id = await interaction.client.awaitReply(i, interaction);

                        const data = await EmbedModel.findOne({ ownerID: interaction.user?.id, embedID: id }) as any;
                        if (!data) {
                             await interaction.editReply({ content: 'You have no saved embeds with that ID' })
                             setTimeout(async () => {
                                await interaction.editReply({ content: msgsing })
                            }, 3000)
                        } else {
                            await EmbedModel.findOneAndDelete({ ownerID: interaction.user?.id, embedID: id })
                            await interaction.editReply({ content: `Deleted your embed with ID ${id}` })
                            setTimeout(async () => {
                                await interaction.editReply({ content: msgsing })
                            }, 3000)
                        }
                    }
                    if (i.customId == 'save') {
                        const data = await EmbedModel.findOne({ embedID: btnMsg.id }) as any;
                        if (data) {
                            await EmbedModel.findOneAndUpdate({ embedID: btnMsg.id }, { embedData: embed, contentData: msgsing })
                            await i.reply({ content: `*Overwrite your old data...*\nSaved your embedbuilder's ID as ${btnMsg.id}`, ephemeral: true })
                        } else {
                            const newData = new EmbedModel({
                                ownerID: interaction.user.id,
                                embedID: btnMsg.id,
                                embedData: embed.toJSON(), // save as a JSON format so it can be loaded later
                                contentData: msgsing||'cactus_no_con_tent',
                            })
                            await newData.save()

                        await i.reply({ content: `Saved your embedbuilder's ID as ${btnMsg.id}`, ephemeral: true })
                        }
                    }
                    if (i.customId == 'load') {
                        await i.deferReply({ ephemeral: true })
                        const rowed = new Discord.ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new Discord.ButtonBuilder()
                            .setCustomId('load_discord')
                            .setLabel('Load from Discord-Msg-ID')
                            .setStyle(Discord.ButtonStyle.Secondary),
                            new Discord.ButtonBuilder()
                            .setCustomId('load_db')
                            .setLabel('Load from Database-ID')
                            .setStyle(Discord.ButtonStyle.Secondary),
                            new Discord.ButtonBuilder()
                            .setCustomId('load_json')
                            .setLabel('Load from JSON')
                            .setStyle(Discord.ButtonStyle.Primary)
                            .setEmoji('👑'),
                        )
                        await i.editReply({ content: 'Which way do you wish to load a embed?', components: [rowed] })

                        const filter = (i: any) => i.user.id === interaction.user.id
                        const collector = i.channel.createMessageComponentCollector({ filter, time: 1800000 })

                        collector.on('collect', async (i: any) => {
                            if (i.customId == 'load_discord') {
                                const fields = {
                                    guild: new Discord.TextInputBuilder()
                                    .setCustomId('guild')
                                    .setPlaceholder('Enter a guildID')
                                    .setStyle(Discord.TextInputStyle.Short)
                                    .setLabel('GuildID')
                                    .setRequired(true),
                                    msg: new Discord.TextInputBuilder()
                                    .setCustomId('msg')
                                    .setPlaceholder('Enter a messageID')
                                    .setStyle(Discord.TextInputStyle.Short)
                                    .setLabel('MessageID')
                                    .setRequired(true),
                                    channel: new Discord.TextInputBuilder()
                                    .setCustomId('channel')
                                    .setPlaceholder('Enter a channelID')
                                    .setStyle(Discord.TextInputStyle.Short)
                                    .setLabel('ChannelID')
                                    .setRequired(true),
                                } as any;
        
                                const modal = new Discord.ModalBuilder()
                                .setTitle('Set the author')
                                .setCustomId('author')
                                .setComponents([
                                    new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>()
                                    .addComponents(
                                        fields.guild,
                                    ),
                                    new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>()
                                    .addComponents(
                                        fields.msg,
                                    ),
                                    new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>()
                                    .addComponents(
                                        fields.channel,
                                    ),
                                ])
        
                                await i.showModal(modal)
        
                                const submitted = await interaction.awaitModalSubmit({
                                    time: 1800000,
                                    filter: i => i.user.id === interaction.user.id,
                                  }).catch(error => {
                                    console.error(error)
                                    return null
                                  })
        
                                  if (submitted) {
                                    await submitted.deferUpdate();
                                    let guild = submitted.fields.getTextInputValue('guild');
                                    let msg = submitted.fields.getTextInputValue('msg');
                                    let ch = submitted.fields.getTextInputValue('channel');

                                    const guilds = await interaction.client.guilds.fetch(guild)
                                    if(!guilds) {
                                        await i.editReply({ content: 'Invalid guild ID'})
                                    }
                                    const channel = await guilds.channels.fetch(ch) as any;
                                    if(!channel) {
                                        await i.editReply({ content: 'Invalid channel ID' })
                                    }
                                    const message = await channel.messages.fetch(msg) as any;
                                    if(!message) {
                                        await i.editReply({ content: 'Invalid message ID' })
                                    }
                                    if(message.embeds.length > 1) {
                                        await i.editReply({ content: 'This message has more than 1 embed, please enter the index of the embed you want to load', components: [] })
                                        const index = await interaction.client.awaitReply(i, interaction);
                                        if(!index) {
                                            await i.editReply({ content: 'Invalid index' })
                                            return
                                        }
                                        if(isNaN(index)) {
                                            await i.editReply({ content: 'Invalid index' })
                                            return
                                        }
                                        if(!message.embeds[index - 1]) {
                                            await i.editReply({ content: 'Invalid index' })
                                            return
                                        }
                                        embed = new EmbedBuilder(message.embeds[index - 1].toJSON());
                                        msgsing = message.content||null;

                                        await i.editReply({ content: 'Loaded your embed from Discord using embed '+index, components: [] })
                                        await interaction.editReply({ content: message.content||null, embeds: [message.embeds[index - 1]], components: [actionRow, actionRow2] })

                                    } else {

                                    embed = new EmbedBuilder(message.embeds[0].toJSON());
                                    msgsing = message.content||null;

                                    await i.editReply({ content: 'Loaded your embed from Discord', components: [] })
                                    await interaction.editReply({ content: message.content||null, embeds: [message.embeds[0]], components: [actionRow, actionRow2] })
                                    }
                                  }
                            }
                            if (i.customId == 'load_db') {
                                await i.deferUpdate();
                                await i.editReply(`Please enter the ID of the embed you want to load`)
                                const id = await interaction.client.awaitReply(i, interaction);

                                const data = await EmbedModel.findOne({ ownerID: interaction.user?.id, embedID: id }) as any;
                                if (!data) {
                                    await i.editReply({ content: 'You have no saved embeds with that ID', components: [] })
                                } else {
                                    if(data.contentData == 'cactus_no_con_tent') data.contentData = null;
                                    embed = new EmbedBuilder(data.embedData); // shows as a JSON format in the database
                                    msgsing = data.contentData;
                                    console.log(data.embedData)
                                    
                                    await i.editReply({ content: 'Loaded your embed from Database', components: [] })
                                    await interaction.editReply({ content: data.contentData, embeds: [data.embedData], components: [actionRow, actionRow2] }).catch((e: any) => {
                                        console.log(e)
                                        return interaction.editReply({ content: 'I couldn\'t edit the embed, this seems like a system or code error', components: [] })
                                    })
                                }
                            }
                            if (i.customId == 'load_json') {
                                const checkPremium = await interaction.client.checkPremium(interaction.user?.id)
                                if(checkPremium == `cactus_not_in_gu_ld`) {
                                    await i.deferUpdate();
                                    await i.editReply({ content: 'I couldn\'t check your premium role status, join discord.gg/azury\n・ If you are already premium please request for the premium role!' })
                                    return
                                }
                                if(checkPremium == false) {
                                    await i.deferUpdate();
                                    await i.editReply({ content: 'You need to be a premium user to use this feature\n・ Check https://cactus.townbots.co/pricing.html for the pricing' })
                                    return
                                }
                                
                                const fields = {
                                    json: new Discord.TextInputBuilder()
                                    .setCustomId('json')
                                    .setPlaceholder('{\n"description": "This is a description",\n"footer": { "text": "This is a footer" },\n}')
                                    .setStyle(Discord.TextInputStyle.Paragraph)
                                    .setLabel('Embed.JSON')
                                    .setRequired(true),
                                } as any;
        
                                const modal = new Discord.ModalBuilder()
                                .setTitle('Embed Json')
                                .setCustomId('json_embed')
                                .setComponents([
                                    new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>()
                                    .addComponents(
                                        fields.json,
                                    ),
                                ])
        
                                await i.showModal(modal)
                                
        
                                const submitted = await interaction.awaitModalSubmit({
                                    time: 1800000,
                                    filter: i => i.user.id === interaction.user.id,
                                  }).catch(error => {
                                    console.error(error)
                                    return null
                                  })
        
                                  if (submitted) {
                                    let json = submitted.fields.getTextInputValue('json');
                                    await submitted.deferUpdate();

                                    try {
                                    json = JSON.parse(json)
                                    } catch(e) {
                                        const url = await client.pastebin.createPaste({
                                            code: e,
                                            expireDate: ExpireDate.Never,
                                            format: "text",
                                            name: "Embed.JSON error",
                                            publicity: Publicity.Public,
                                        });
                                        await i.editReply({ content: 'Invalid JSON format, for more info:\n'+url, components: [] })
                                        return
                                    }
                                    
                                
                                    await i.editReply({ content: 'Loaded your embed from JSON format', components: [] })
                                    await interaction.editReply({ content: msgsing, embeds: [json], components: [actionRow, actionRow2] }).catch(async(e: any) => {
                                        console.log(e)
                                        console.log(json)
                                        const url = await client.pastebin.createPaste({
                                            code: e,
                                            expireDate: ExpireDate.Never,
                                            format: "text",
                                            name: "Embed.JSON error",
                                            publicity: Publicity.Public,
                                        });
                                        await i.editReply({ content: 'Invalid JSON format, for more info:\n'+url, components: [] })
                                        return
                                    })
                                    embed = new EmbedBuilder(json);
                                  }
        
                            }
                        })
                    }

                    if (i.customId == 'edit') {
                        await i.update({ embeds: [embed], components: [row_back, row, row2] })
                    }
                    if (i.customId == 'clear') {
                        await i.update({ embeds: [embed], components: [row_back, row3, row4] })
                    }
                    if (i.customId == 'clear_fields') {
                        await i.deferUpdate();
                        await interaction.editReply(`Please specify which feild position to delete..`)
                        const id = await interaction.client.awaitReply(i, interaction)

                        if (isNaN(id)) {
                            await interaction.editReply({ content: 'Field position must be a number.' })
                            setTimeout(async () => {
                                await interaction.editReply({ content: msgsing })
                            }, 3000)
                            return
                        }
                        if (id > i.message.embeds[0].fields.length) {
                            await interaction.editReply({ content: 'Field position does not exist.' })
                            setTimeout(async () => {
                                await interaction.editReply({ content: msgsing })
                            }, 3000)
                            return
                        }
                        embed.spliceFields(id - 1, 1)
                        await interaction.editReply({ content: msgsing, embeds: [embed] })
                    }
                    if (i.customId == 'clear_content') {
                        msgsing = null;
                        await i.update({ content: ` ` })
                    }
                    if (i.customId == 'clear_author') {
                        embed.setAuthor({name: null, iconURL: null, url: null})
                        await i.update({ embeds: [embed] })
                    }
                    if (i.customId == 'clear_description') {
                        embed.setDescription(null)
                        await i.update({ embeds: [embed] })
                    }
                    if (i.customId == 'clear_image') {
                        embed.setImage(null)
                        await i.update({ embeds: [embed] })
                    }
                    if (i.customId == 'clear_thumbnail') {
                        embed.setThumbnail(null)
                        await i.update({ embeds: [embed] })
                    }
                    if (i.customId == 'clear_footer') {
                        embed.setFooter({text: null})
                        await i.update({ embeds: [embed] })
                    }
                    if (i.customId == 'clear_title') {
                        embed.setTitle(null)
                        await i.update({ embeds: [embed] })
                    }
                    
                    if (i.customId == 'field') {

                        const fields = {
                            name: new Discord.TextInputBuilder()
                            .setCustomId('name')
                            .setPlaceholder('Enter a name for the field')
                            .setStyle(Discord.TextInputStyle.Short)
                            .setLabel('Name')
                            .setRequired(true),
                            value: new Discord.TextInputBuilder()
                            .setCustomId('value')
                            .setPlaceholder('Enter a value for the field')
                            .setStyle(Discord.TextInputStyle.Paragraph)
                            .setLabel('Value')
                            .setRequired(true),
                        } as any;

                        const modal = new Discord.ModalBuilder()
                        .setTitle('Add a field')
                        .setCustomId('field')
                        .setComponents([
                            new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>()
                            .addComponents(
                                fields.name,
                            ),
                            new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>()
                            .addComponents(
                                fields.value,
                            ),
                        ])

                        await i.showModal(modal)

                        const submitted = await interaction.awaitModalSubmit({
                            time: 1800000,
                            filter: i => i.user.id === interaction.user.id,
                          }).catch(error => {
                            console.error(error)
                            return null
                          })

                          if (submitted) {
                            await submitted.deferUpdate()
                            const name = submitted.fields.getTextInputValue('name');
                            const value = submitted.fields.getTextInputValue('value');
                            embed.addFields({ name: name, value: value })
                            await interaction.editReply({ embeds: [embed] })
                          }

                    }
                    
                    if (i.customId == 'content') {
                        await i.deferUpdate()
                        await interaction.editReply({ content: 'Waiting for your responce...' })
                        const content = await client.awaitReply(i, interaction)
                        msgsing = content;
                        await interaction.editReply({ content: content })
                    }
                    if (i.customId == 'title') {
                        await i.deferUpdate()
                        await interaction.editReply({ content: 'Waiting for your responce...' })
                        const title = await client.awaitReply(i, interaction)
                        embed.setTitle(title)
                        await interaction.editReply({ content: msgsing, embeds: [embed] })
                    }
                    if (i.customId == 'description') {
                        await i.deferUpdate()
                        await interaction.editReply({ content: 'Waiting for your responce...' })
                        const description = await client.awaitReply(i, interaction)
                        embed.setDescription(description)
                        await interaction.editReply({ content: msgsing, embeds: [embed] })
                    }
                    if (i.customId == 'color') {
                        await i.deferUpdate()
                        await interaction.editReply({ content: 'Waiting for your responce...' })
                        const color = await client.awaitReply(i, interaction)
                        if(!color.startsWith('#')) {
                            await interaction.editReply({ content: 'Please enter a valid hex color\n\n' })
                            setTimeout(async () => {
                                await interaction.editReply({ content: msgsing })
                            }, 3000)
                        } else {
                        embed.setColor(color)
                        await interaction.editReply({ content: msgsing, embeds: [embed] })
                        }
                    }
                    if (i.customId == 'footer') {
                        await i.deferUpdate()
                        await interaction.editReply({ content: 'Waiting for your responce...' })
                        const footer = await client.awaitReply(i, interaction)
                        embed.setFooter({ text: footer })
                        await interaction.editReply({ content: msgsing, embeds: [embed] })
                    }
                    if (i.customId == 'image') {
                        await i.deferUpdate()
                        await interaction.editReply({ content: 'Waiting for your responce...' })
                        const image = await client.awaitReply(i, interaction)

                        await interaction.client.checkURL(image).then(async (res: any) => {
                        if(res == true) {
                    embed.setImage(image)
                    await interaction.editReply({ content: msgsing, embeds: [embed] })
                        } else {
                            await interaction.editReply({ content: 'Please enter a valid image url (png, jpg, jpeg, gif)\n\n' })
                            setTimeout(async () => {
                                await interaction.editReply({ content: msgsing })
                            }, 3000)
                        }
                        })
                    
                }
                    if (i.customId == 'thumbnail') {
                        await i.deferUpdate()
                        await interaction.editReply({ content: 'Waiting for your responce...' })
                        const thumbnail = await client.awaitReply(i, interaction)

                        await interaction.client.checkURL(thumbnail).then(async (res: any) => {
                            if(res == true) {
                        embed.setThumbnail(thumbnail)
                        await interaction.editReply({ content: msgsing, embeds: [embed] })
                            } else {
                                await interaction.editReply({ content: 'Please enter a valid image url (png, jpg, jpeg, gif)\n\n' })
                                setTimeout(async () => {
                                    await interaction.editReply({ content: msgsing })
                                }, 3000)
                            }
                            })
                }
                    if (i.customId == 'author') {

                        const fields = {
                            name: new Discord.TextInputBuilder()
                            .setCustomId('name')
                            .setPlaceholder('Enter a name for the author')
                            .setStyle(Discord.TextInputStyle.Short)
                            .setLabel('Name')
                            .setRequired(true),
                            url: new Discord.TextInputBuilder()
                            .setCustomId('url')
                            .setPlaceholder('Enter a url for the field')
                            .setStyle(Discord.TextInputStyle.Short)
                            .setLabel('Url')
                            .setRequired(false),
                            icon: new Discord.TextInputBuilder()
                            .setCustomId('icon')
                            .setPlaceholder('Enter a icon for the field')
                            .setStyle(Discord.TextInputStyle.Short)
                            .setLabel('Icon')
                            .setRequired(false),
                        } as any;

                        const modal = new Discord.ModalBuilder()
                        .setTitle('Set the author')
                        .setCustomId('author')
                        .setComponents([
                            new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>()
                            .addComponents(
                                fields.name,
                            ),
                            new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>()
                            .addComponents(
                                fields.url,
                            ),
                            new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>()
                            .addComponents(
                                fields.icon,
                            ),
                        ])

                        await i.showModal(modal)

                        const submitted = await interaction.awaitModalSubmit({
                            time: 1800000,
                            filter: i => i.user.id === interaction.user.id,
                          }).catch(error => {
                            console.error(error)
                            return null
                          })

                          if (submitted) {
                            await submitted.deferUpdate()
                            let name = submitted.fields.getTextInputValue('name');
                            let url = submitted.fields.getTextInputValue('url')||null;
                            let icon = submitted.fields.getTextInputValue('icon')||null;

                            if(icon) {
                                await interaction.client.checkURL(icon).then(async (res: any) => {
                                    if(res == false) {
                                        icon = null; // check if icon is valid
                                    }
                                })
                            }

                            if(!url.startsWith('https://')) {
                                url = null; // check if url is valid
                            }

                            embed.setAuthor({ name: name, url: url, iconURL: icon })
                            await interaction.editReply({ embeds: [embed] })
                          }
                    }
                    
                    if (i.customId == 'send') {
                        const option = new Discord.ActionRowBuilder<ButtonBuilder>({
                            components: [
                                new Discord.ButtonBuilder()
                                .setCustomId('send_bot')
                                .setLabel('Send as Bot')
                                .setStyle(Discord.ButtonStyle.Secondary),
                                new Discord.ButtonBuilder()
                                .setCustomId('send_webhook')
                                .setLabel('Send as Webhook')
                                .setEmoji(`👑`)
                                .setStyle(Discord.ButtonStyle.Primary),
                            ]
                        })
                        const btnMSg = await interaction.editReply({ content: 'How do you want to send this embed?', components: [option] })

                        const filter = (i2: any) => i2.user.id === interaction.user.id;
                        const collector12 = btnMSg.createMessageComponentCollector({ filter, time: 1800000, max: 1 });
                        collector12.on('collect', async (i2: any) => {
                            if(i2.customId == 'send_bot') {
                                i2.deferUpdate()
                                collector.stop()
                                await channel.send({ content: msgsing, embeds: [embed] }).then(async (msg: any) => {
                                    interaction.editReply({ content: `Sent the embed to ${channel}\nJump: ${msg.url}`, embeds: [], components: [] })
                                    }).catch(async (err: any) => {
                                        interaction.editReply({ content: `I was unable to send the embed to ${channel}`, embeds: [], components: [] })
                                    })
                            } else if(i2.customId == 'send_webhook') {
                                const checkPremium = await i2.client.checkPremium(i2.user?.id)
                                i2.deferUpdate()
                                if(checkPremium == `cactus_not_in_gu_ld`) {
                                    await interaction.editReply({ content: 'I couldn\'t check your premium role status, join discord.gg/azury\n・ If you are already premium please request for the premium role!' })
                                    return
                                }
                                if(checkPremium == false) {
                                    await interaction.editReply({ content: 'You need to be a premium user to use this feature\n・ Check https://cactus.townbots.co/pricing.html for the pricing' })
                                    return
                                }

                               await interaction.editReply({ content: 'What should be the webhook name?', components: [] })
                                 const name = await (interaction.channel as any)?.awaitMessages({ filter: (m: any) => m.author.id === interaction.user.id, max: 1, time: 1800000, errors: ['time'] }).then(async (collected: any) => {
                                    await collected.first().delete()
                                    return collected.first().content
                                }).catch(async (err: any) => {
                                    await interaction.editReply({ content: 'You didn\'t provide a name in time' })
                                    return
                                })

                                await interaction.editReply({ content: 'What should be the webhook avatar?' })

                                const avatar = await (interaction.channel as any)?.awaitMessages({ filter: (m: any) => m.author.id === interaction.user.id, max: 1, time: 1800000, errors: ['time'] }).then(async (collected: any) => {
                                    await collected.first().delete()
                                    return collected.first().content
                                }).catch(async (err: any) => {
                                    await interaction.editReply({ content: 'You didn\'t provide a avatar in time' })
                                    return
                                })

                                await interaction.client.checkURL(avatar).then(async (res: any) => {
                                    if(res == false) {
                                       await interaction.editReply({ content: 'The avatar you provided isn\'t a valid url' })
                                        return
                                    }
                                })

                                await channel.createWebhook({name, avatar: avatar}).then(async (webhook: any) => {
                                    collector.stop()
                                    await webhook.send({ content: msgsing, embeds: [embed] }).then(async (msg: any) => {
                                        await webhook.delete()
                                       await interaction.editReply({ content: `Sent the embed to ${channel}\nJump: ${msg.url}`, embeds: [], components: [] })
                                    }).catch(async (err: any) => {
                                        await webhook.delete()
                                       await interaction.editReply({ content: `I was unable to send the embed to ${channel}`, embeds: [], components: [] })
                                    })
                                }).catch(async (err: any) => {
                                    interaction.editReply({ content: `I was unable to create a webhook in ${channel}`, embeds: [], components: [] })
                                })

                            }
                        })
                    }
                })
        
            } 
        if((interaction.options as any).getSubcommandGroup() == 'giveaway') {
            if((interaction.options as any).getSubcommand() == 'create') {
                const channel = (interaction.options as any).getChannel('channel') || interaction.channel
                const time = (interaction.options as any).getString('time')
                const winners = (interaction.options as any).getInteger('winners')
                const prize = (interaction.options as any).getString('prize')
                const description = (interaction.options as any).getString('description') || 'No description provided'
                
                if(!channel) return interaction.reply({ content: await client.translate('Please provide a channel', interaction.guild?.id), ephemeral: true })
                if(!time) return interaction.reply({ content: await client.translate('Please provide a time', interaction.guild?.id), ephemeral: true })
                if(!winners) return interaction.reply({ content: await client.translate('Please provide a number of winners', interaction.guild?.id), ephemeral: true })
                if(!prize) return interaction.reply({ content: await client.translate('Please provide a prize', interaction.guild?.id), ephemeral: true })

                const msTime = ms(time)
                
                const embeds = new Discord.EmbedBuilder()
                .setDescription(`${description}`)
                .addFields(
                    { name: 'Prize', value: `\`\`\`${prize}\`\`\``, inline: true },
                    { name: 'Winners', value: `\`\`\`${winners}\`\`\``, inline: true },
                    { name: 'Ends', value: `<t:${Math.floor((Date.now() + (msTime as any)) / 1000)}:R> *(<t:${Math.floor((Date.now() + (msTime as any)) / 1000)}:D>)*`, inline: false },
                )
                .setColor(await interaction.client.embedColor(interaction.user))
                .setTimestamp()
                .setFooter({ text: `Hosted by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                
                const msg = await channel.send({ embeds: [embeds] })

                const data = await GiveawayModel.findOne({ hostID: interaction.guild?.id, giveawayID: msg.id })
                if(data) return interaction.reply({ content: await client.translate('This giveaway is already in the database', interaction.guild?.id), ephemeral: true })

                new GiveawayModel({
                    guildID: interaction.guild?.id,
                    channelID: channel.id,
                    hostID: interaction.guild?.id,
                    giveawayID: msg.id,
                    prize: prize,
                    winnerCount: winners,
                    ends: Date.now() + msTime,
                    ended: false,
                }).save()

                
                const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                .addComponents([
                    new Discord.ButtonBuilder()
                    .setCustomId('giveaway_'+msg.id)
                    .setLabel('Enter')
                    .setEmoji(`1065399898440208484`)
                    .setStyle(Discord.ButtonStyle.Secondary),
                    new Discord.ButtonBuilder()
                    .setCustomId('participants_'+msg.id)
                    .setLabel('Participants')
                    .setStyle(Discord.ButtonStyle.Secondary),
                ])

                await msg.edit({ embeds: [embeds], components: [row] })

            }
        }
        if ((interaction.options as any).getSubcommand() == 'ban') {
            const user = (interaction.options as any).getUser('user')
            const reason = (interaction.options as any).getString('reason') || 'No reason provided'
            
            const member = interaction.guild.members.cache.get(user.id);
            console.log(user)
            if (member) {
                member.ban({ reason: reason })
                interaction.reply({ content: `Banned ${user.username} for ${reason}`, ephemeral: true })
            } else {
                interaction.reply({ content: `Couldn't find that user, make sure they are in the server`, ephemeral: true })
            }
        } else if ((interaction.options as any).getSubcommand() == 'kick') {
            const user = (interaction.options as any).getUser('user')
            const reason = (interaction.options as any).getString('reason') || 'No reason provided'

            const member = interaction.guild.members.cache.get(user.id);
            if (member) {
                member.kick(reason)
                interaction.reply({ content: `Kicked ${user.username} for ${reason}`, ephemeral: true })
            } else {
                interaction.reply({ content: `Couldn't find that user, make sure they are in the server`, ephemeral: true })
            }
        } else if ((interaction.options as any).getSubcommand() == 'warn') {
            const user = (interaction.options as any).getUser('user')
            const reason = (interaction.options as any).getString('reason') || 'No reason provided'
            
            const member = interaction.guild.members.cache.get(user.id);
            if (member) {
                const data = { reason: reason, moderator: interaction.user.id, date: Math.floor(+Date.now()/1000), id: Math.floor(Math.random() * 100000000000000000) }
                const warnings = await WarningsModel.findOne({ guildID: interaction.guild.id, userID: user.id })
                let warns = 0;
                if (warnings) {
                    warnings.warnings.push(data)
                    warnings.save()
                    warns = warnings.warnings.length
                } else {
                    new WarningsModel({
                        userID: user.id,
                        guildID: interaction.guild.id,
                        warnings: [data]
                    }).save()
                    warns = 1
                }
                interaction.reply({ content: `Warned ${user.username} for ${reason}, they now have ${warns} warnings`, ephemeral: true })

                user.send({ content: `You have been warned in ${interaction.guild.name} for ${reason}\nYou now have ${warns} warnings` }).catch(() => {})
            } else {
                interaction.reply({ content: `Couldn't find that user, make sure they are in the server`, ephemeral: true })
            }
        } else if ((interaction.options as any).getSubcommand() == 'warnings') {
            const user = (interaction.options as any).getUser('user')
            const warnings = await WarningsModel.findOne({ guildID: interaction.guild.id, userID: user.id })
            if(warnings.warnings.length < 1) return interaction.reply({ content: `This user has no warnings`, ephemeral: true })
            if (warnings) {
                const embeds = new Discord.EmbedBuilder()
                .setTitle(`Warnings for ${user.username}`)
                .setColor(await interaction.client.embedColor(interaction.user))
                .setTimestamp()
                .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
                warnings.warnings.forEach((warning: any) => {
                    embeds.addFields(
                        { name: `Warning ${warning.id}`, value: `Reason: ${warning.reason}\nModerator: <@${warning.moderator}>\nDate: <t:${warning.date}:R>` },
                    )
                })
                interaction.reply({ embeds: [embeds] })
            } else {
                interaction.reply({ content: `This user has no warnings`, ephemeral: true })
            }
        } else if ((interaction.options as any).getSubcommand() == 'unwarn') {
            const user = (interaction.options as any).getUser('user')
            const id = (interaction.options as any).getInteger('warning')
            const warnings = await WarningsModel.findOne({ guildID: interaction.guild.id, userID: user.id })
            if (warnings) {
                const warning = warnings.warnings.find((warning: any) => warning.id == id)
                console.log(warning)
                if (warning) {
                    warnings.warnings = warnings.warnings.filter((warning: any) => warning.id != id)
                    warnings.save()
                    interaction.reply({ content: `Removed warning ${id} from ${user.username}`, ephemeral: true })
                } else {
                    interaction.reply({ content: `This user doesn't have a warning with that id`, ephemeral: true })
                }
            } else {
                interaction.reply({ content: `This user has no warnings`, ephemeral: true })
            }
        } else if ((interaction.options as any).getSubcommand() == 'purge') {
            const amount = (interaction.options as any).getInteger('amount');
            const channel = (interaction.options as any).getChannel('channel') || interaction.channel;

            if(amount > 100) return interaction.reply({ content: `You cannot purge more than 100 messages due to discord API limit`, ephemeral: true })
            if(amount < 1) return interaction.reply({ content: `You less than 1 message, as there would be nothing to purge`, ephemeral: true })

            interaction.reply({ content: `Purging ${amount} messages in ${channel.toString()}...`, ephemeral: true })

            await channel.bulkDelete(amount, true).catch((e: any) => {
                interaction.reply({ content: `I was unable to purge the messages\n\`\`\`${e}\`\`\``, ephemeral: true })
            })

            await channel.send({ content: 'Purged **'+amount+'** messages by '+interaction.user.toString()})
        }
    }
}

export default command