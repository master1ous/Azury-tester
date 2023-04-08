import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder, CommandInteraction, SlashCommandSubcommandBuilder, ChatInputCommandInteraction, ButtonBuilder, ButtonInteraction, ColorResolvable, GuildPremiumTier, ActionRowBuilder, ButtonStyle } from "discord.js"
import Discord from "discord.js";
import { SlashCommand, SlashCommandList } from "../types";
import { PasteClient, Publicity, ExpireDate } from "pastebin-api";
import { pagesystem } from "../functions";
import ms = require("ms")
import os from 'os'
import { isFunctionExpression } from "typescript";
import { execSync } from "child_process";
import axios from "axios";
import Canvas from "canvas";
import PremiumCode from "../schemas/PremiumCode";
import PremiumUser from "../schemas/PremiumUser";

const command: SlashCommand = {
    cooldown: 10,
    command: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Use the info sub commands")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
        subcommand.setName('botstats')
            .setDescription('Shows the bot\'s statstics')
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('invite')
            .setDescription('Shows the bot\'s invite link')
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('help')
            .setDescription('Shows the bot\'s commands')
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('guide')
            .setDescription('Shows the bot\'s guiding')
    )
    .addSubcommandGroup((group) =>
    group.setName('server')
            .setDescription('Shows the server sub commands')
    .addSubcommand((subcommand) =>
        subcommand.setName('info')
            .setDescription('Shows the server\'s info')
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('shard')
            .setDescription('Shows the server\'s shard')
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('boosters')
            .setDescription('Shows the server\'s boosters')
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('channels')
            .setDescription('Shows the server\'s channels')
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('roles')
            .setDescription('Shows the server\'s roles')
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('emojis')
            .setDescription('Shows the server\'s emojis')
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('bans')
            .setDescription('Shows the server\'s bans')
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('members')
            .setDescription('Shows the server\'s members')
    )
    )
    .addSubcommandGroup((group) =>
    group.setName('premium')
            .setDescription('Shows the users\'s premium info')
    .addSubcommand((subcommand) =>
        subcommand.setName('info')
            .setDescription('Shows the user\'s premium info')
        .addUserOption(option =>
            option.setName('user')
            .setRequired(false)
            .setDescription('Enter a user to show premium info')
        )
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('redeem')
            .setDescription('Redeem a premium code')
        .addStringOption(option =>
            option.setName('code')
            .setRequired(true)
            .setDescription('Enter a premium code to redeem')
        )
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('create')
            .setDescription('Create a premium code')
        .addStringOption(option =>
            option.setName('expires')
            .setRequired(true)
            .setDescription('Enter a time to expire the premium code')
        )
    )
    .addSubcommand((subcommand) =>
        subcommand.setName('list-codes')
            .setDescription('List all premium codes')
    )
    )
    .addSubcommand((subcommand) =>
    subcommand.setName('weatherinfo')
            .setDescription('Shows the weather\'s state')
            .addStringOption(option =>
                option.setName('place')
                .setRequired(true)
                .setDescription('Enter a place to show weather')
            )
    )

    .addSubcommand((subcommand) =>
    subcommand.setName('roleinfo')
        .setDescription('Shows the role\'s info')
            .addRoleOption(option =>
                option.setName('role')
                .setRequired(true)
                .setDescription('Enter a role to show info')
            )
    )
    .addSubcommand((subcommand) =>
    subcommand.setName('channelinfo')
        .setDescription('Shows the channel\'s info')
            .addChannelOption(option =>
                option.setName('channel')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.GuildNews)
                .setDescription('Enter a channel to show info')
            )
    )
    .addSubcommandGroup((group) =>
        group.setName('user')
        .setDescription('Use the user sub commands')
        .addSubcommand((subcommand) =>
            subcommand.setName('invites')
            .setDescription('Shows the users\'s invites')
            .addUserOption(option =>
                option.setName('user')
                .setRequired(false)
                .setDescription('Enter a user to show invites')
            )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('info')
            .setDescription('Shows the users\'s info')
            .addUserOption(option =>
                option.setName('user')
                .setRequired(false)
                .setDescription('Enter a user to show info')
            )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('avatar')
            .setDescription('Shows the users\'s avatar')
            .addUserOption(option =>
                option.setName('user')
                .setRequired(false)
                .setDescription('Enter a user to show avatar')
            )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('banner')
            .setDescription('Shows the users\'s banner')
            .addUserOption(option =>
                option.setName('user')
                .setRequired(false)
                .setDescription('Enter a user to show banner')
            )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('badges')
            .setDescription('Shows the users\'s badges')
            .addUserOption(option =>
                option.setName('user')
                .setRequired(false)
                .setDescription('Enter a user to show badges')
            )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName('roles')
            .setDescription('Shows the users\'s roles')
            .addUserOption(option =>
                option.setName('user')
                .setRequired(false)
                .setDescription('Enter a user to show roles')
            )
        )
    ),
            execute: async (interaction) => {
                const client = interaction.client
                if((interaction.options as any).getSubcommandGroup() == 'server') {
                    if((interaction.options as any).getSubcommand() == 'info') {
                        await interaction.deferReply({ ephemeral: true })

                        
                        const embed = new EmbedBuilder()
                        .setAuthor({ name: await client.translate(`Info for`, interaction.guild?.id)+` ${interaction.guild?.name}`, iconURL: interaction.guild?.iconURL() })
                        .setColor(await interaction.client.embedColor(interaction.user))
                        .setTimestamp()
                        .setFooter({ text: `Cactus Bot - GID: ${interaction.guild?.id}`, iconURL: interaction.client.user?.displayAvatarURL() })
                        .addFields(
                        { name: await client.translate(`Name`, interaction.guild?.id), value: interaction.guild?.name||await client.translate('No name', interaction.guild?.id), inline: true },
                        { name: await client.translate(`Owner`, interaction.guild?.id), value: `<@${interaction.guild?.ownerId}>`, inline: true },
                        { name: await client.translate(`Created at`, interaction.guild?.id), value: `<t:${Math.floor(interaction.guild?.createdAt.getTime() / 1000)}:R>`, inline: true },
                        { name: await client.translate(`Members`, interaction.guild?.id), value: interaction.guild?.memberCount ? `${interaction.guild?.memberCount}` : await client.translate('No members', interaction.guild?.id), inline: true },
                        { name: await client.translate(`Channels`, interaction.guild?.id), value: interaction.guild?.channels.cache.size ? `${interaction.guild?.channels.cache.size}` : await client.translate('No channels', interaction.guild?.id), inline: true },
                        { name: await client.translate(`Roles`, interaction.guild?.id), value: interaction.guild?.roles.cache.size ? `${interaction.guild?.roles.cache.size}` : await client.translate('No roles', interaction.guild?.id), inline: true },
                        { name: await client.translate(`Emojis`, interaction.guild?.id), value: interaction.guild?.emojis.cache.size ? `${interaction.guild?.emojis.cache.size}` : await client.translate('No emojis', interaction.guild?.id), inline: true },
                        { name: await client.translate(`Boosts`, interaction.guild?.id), value: interaction.guild?.premiumSubscriptionCount ? `${interaction.guild?.premiumSubscriptionCount}` : await client.translate('No boosts', interaction.guild?.id), inline: true },
                        { name: await client.translate(`Boost tier`, interaction.guild?.id), value: interaction.guild?.premiumTier ? `${interaction.guild?.premiumTier}` : await client.translate('No boost tier', interaction.guild?.id), inline: true },
                        { name: await client.translate(`AFK channel`, interaction.guild?.id), value: interaction.guild?.afkChannel ? `<#${interaction.guild?.afkChannelId}>` : await client.translate(`No AFK channel`, interaction.guild?.id), inline: true },
                        { name: await client.translate(`AFK timeout`, interaction.guild?.id), value: interaction.guild?.afkTimeout ? `${ms(interaction.guild?.afkTimeout, { long: true })}` : await client.translate(`No AFK timeout`, interaction.guild?.id), inline: true },
                        { name: await client.translate(`System channel`, interaction.guild?.id), value: interaction.guild?.systemChannel ? `<#${interaction.guild?.systemChannelId}>` : await client.translate(`No system channel`, interaction.guild?.id), inline: true },
                        { name: await client.translate(`Rules channel`, interaction.guild?.id), value: interaction.guild?.rulesChannel ? `<#${interaction.guild?.rulesChannelId}>` : await client.translate(`No rules channel`, interaction.guild?.id), inline: true },
                        { name: await client.translate(`Public updates channel`, interaction.guild?.id), value: interaction.guild?.publicUpdatesChannel ? `<#${interaction.guild?.publicUpdatesChannelId}>` : await client.translate(`No public updates channel`, interaction.guild?.id), inline: true },
                        { name: await client.translate(`Banner`, interaction.guild?.id), value: interaction.guild?.banner ? `[${await client.translate(`Click here`, interaction.guild?.id)}](${interaction.guild?.bannerURL({ size: 2048 })})` : await client.translate(`No banner`, interaction.guild?.id), inline: true },
                        { name: await client.translate(`Splash`, interaction.guild?.id), value: interaction.guild?.splash ? `[${await client.translate(`Click here`, interaction.guild?.id)}](${interaction.guild?.splashURL({ size: 2048 })})` : await client.translate(`No splash`, interaction.guild?.id), inline: true },
                        { name: await client.translate(`Discovery splash`, interaction.guild?.id), value: interaction.guild?.discoverySplash ? `[${await client.translate(`Click here`, interaction.guild?.id)}](${interaction.guild?.discoverySplashURL({ size: 2048 })})` : await client.translate(`No discovery splash`, interaction.guild?.id), inline: true },
                        { name: await client.translate(`Icon`, interaction.guild?.id), value: interaction.guild?.icon ? `[${await client.translate(`Click here`, interaction.guild?.id)}](${interaction.guild?.iconURL({ size: 2048 })})` : await client.translate(`No icon`, interaction.guild?.id), inline: true },
                        { name: await client.translate(`Vanity URL`, interaction.guild?.id), value: interaction.guild?.vanityURLCode ? `discord.gg/${interaction.guild?.vanityURLCode}` : await client.translate(`No vanity URL`, interaction.guild?.id), inline: true },
                    )

                      await interaction.editReply({ embeds: [embed] })
                    } 
                    if((interaction.options as any).getSubcommand() == 'shard') {
                        await interaction.deferReply({ ephemeral: true })

                        const embed = new EmbedBuilder()
                        .setTitle(await client.translate(`Shard`, interaction.guild?.id))
                        .setColor(await interaction.client.embedColor(interaction.user))
                        .setDescription(await client.translate(`Shard ID: ${interaction.guild?.shardId}`, interaction.guild?.id))
                        .setFooter({ text: await client.translate(`Requested by ${interaction.user.tag}`, interaction.guild?.id), iconURL: interaction.user.displayAvatarURL() })
                        .setTimestamp()

                        await interaction.editReply({ embeds: [embed] })
                    }
                    if((interaction.options as any).getSubcommand() == 'boosters') {
                        await interaction.deferReply({ ephemeral: true })

                        const embed = new EmbedBuilder()
                        .setTitle(await client.translate(`Boosters`, interaction.guild?.id))
                        .setColor(await interaction.client.embedColor(interaction.user))
                        .setDescription(await client.translate(`Boosters: ${interaction.guild?.premiumSubscriptionCount}`, interaction.guild?.id))
                        .setFooter({ text: await client.translate(`Requested by ${interaction.user.tag}`, interaction.guild?.id), iconURL: interaction.user.displayAvatarURL() })
                        .setTimestamp()

                        await interaction.editReply({ embeds: [embed] })
                    }
                    if((interaction.options as any).getSubcommand() == 'channels') {
                        await interaction.deferReply({ ephemeral: true })

                        const embed = new EmbedBuilder()
                        .setTitle(await client.translate(`Channels`, interaction.guild?.id))
                        .setColor(await interaction.client.embedColor(interaction.user))
                        .setDescription(await client.translate(`Channels: ${interaction.guild?.channels.cache.size}`, interaction.guild?.id))
                        .addFields(
                            { name: await client.translate(`Text channels`, interaction.guild?.id), value: `${interaction.guild?.channels.cache.filter(c => c.type == 0).size}`, inline: true },
                            { name: await client.translate(`Voice channels`, interaction.guild?.id), value: `${interaction.guild?.channels.cache.filter(c => c.type == 2).size}`, inline: true },
                            { name: await client.translate(`Categories`, interaction.guild?.id), value: `${interaction.guild?.channels.cache.filter(c => c.type == 4).size}`, inline: true },
                            { name: await client.translate(`News channels`, interaction.guild?.id), value: `${interaction.guild?.channels.cache.filter(c => c.type == 5).size}`, inline: true },
                            { name: await client.translate(`Stage channels`, interaction.guild?.id), value: `${interaction.guild?.channels.cache.filter(c => c.type == 13).size}`, inline: true },
                            { name: 'Thread Channels', value: `${interaction.guild?.channels.cache.filter(c => c.type == 11).size}`, inline: true },
                        )
                        .setFooter({ text: await client.translate(`Requested by ${interaction.user.tag}`, interaction.guild?.id), iconURL: interaction.user.displayAvatarURL() })
                        .setTimestamp()

                        await interaction.editReply({ embeds: [embed] })
                    }
                    if((interaction.options as any).getSubcommand() == 'roles') {
                        await interaction.deferReply({ ephemeral: true })

                        const embed = new EmbedBuilder()
                        .setTitle(await client.translate(`Roles`, interaction.guild?.id))
                        .setColor(await interaction.client.embedColor(interaction.user))
                        .setDescription(await client.translate(`Roles: ${interaction.guild?.roles.cache.size}`, interaction.guild?.id))
                        .addFields(
                            // show the used roles and map them and if too long show ...and {x} more
                            { name: await client.translate(`Used roles`, interaction.guild?.id), value: `${interaction.guild?.roles.cache.filter(r => r.members.size != 0).map(r => r).join(', ').length > 900 ? `${interaction.guild?.roles.cache.filter(r => r.members.size != 0).map(r => r).join(', ').slice(0, 900)}...and ${interaction.guild?.roles.cache.filter(r => r.members.size != 0).map(r => r).join(', ').length - interaction.guild?.roles.cache.filter(r => r.members.size != 0).map(r => r).join(', ').slice(0, 900).length} more` : interaction.guild?.roles.cache.filter(r => r.members.size != 0).map(r => r).join(', ')}`, inline: false },
                            // show the unused roles and map them and if too long show ...and {x} more
                            { name: await client.translate(`Unused roles`, interaction.guild?.id), value: `${interaction.guild?.roles.cache.filter(r => r.members.size == 0).map(r => r).join(', ').length > 900 ? `${interaction.guild?.roles.cache.filter(r => r.members.size == 0).map(r => r).join(', ').slice(0, 900)}...and ${interaction.guild?.roles.cache.filter(r => r.members.size == 0).map(r => r).join(', ').length - interaction.guild?.roles.cache.filter(r => r.members.size == 0).map(r => r).join(', ').slice(0, 900).length} more` : interaction.guild?.roles.cache.filter(r => r.members.size == 0).map(r => r).join(', ')}`, inline: false },
                            // show the roles which have color and map them and if too long show ...and {x} more
                            { name: await client.translate(`Colored roles`, interaction.guild?.id), value: `${interaction.guild?.roles.cache.filter(r => r.color != 0).map(r => r).join(', ').length > 900 ? `${interaction.guild?.roles.cache.filter(r => r.color != 0).map(r => r).join(', ').slice(0, 900)}...and ${interaction.guild?.roles.cache.filter(r => r.color != 0).map(r => r).join(', ').length - interaction.guild?.roles.cache.filter(r => r.color != 0).map(r => r).join(', ').slice(0, 900).length} more` : interaction.guild?.roles.cache.filter(r => r.color != 0).map(r => r).join(', ')}`, inline: false },
                            // show the roles which have no color and map them and if too long show ...and {x} more which shows the amount of roles left
                            { name: await client.translate(`Uncolored roles`, interaction.guild?.id), value: `${interaction.guild?.roles.cache.filter(r => r.color == 0).map(r => r).join(', ').length > 900 ? `${interaction.guild?.roles.cache.filter(r => r.color == 0).map(r => r).join(', ').slice(0, 900)}...and ${interaction.guild?.roles.cache.filter(r => r.color == 0).map(r => r).join(', ').length - interaction.guild?.roles.cache.filter(r => r.color == 0).map(r => r).join(', ').slice(0, 900).length} more` : interaction.guild?.roles.cache.filter(r => r.color == 0).map(r => r).join(', ')}`, inline: false },
                        )
                        .setFooter({ text: await client.translate(`Requested by ${interaction.user.tag}`, interaction.guild?.id), iconURL: interaction.user.displayAvatarURL() })
                        .setTimestamp()

                        await interaction.editReply({ embeds: [embed] })
                    }
                    if((interaction.options as any).getSubcommand() == 'emojis') {
                        await interaction.deferReply({ ephemeral: true })

                        const embed = new EmbedBuilder()
                        .setTitle(await client.translate(`Emojis`, interaction.guild?.id))
                        .setColor(await interaction.client.embedColor(interaction.user))
                        .setDescription(await client.translate(`Emojis: ${interaction.guild?.emojis.cache.size}`, interaction.guild?.id))
                        .addFields(
                            // show the total emojis in the server and if too long show ...and {x} more
                            { name: await client.translate(`Total emojis`, interaction.guild?.id), value: `${interaction.guild?.emojis.cache.map(e => e).join(', ').length > 900 ? `${interaction.guild?.emojis.cache.map(e => e).join(', ').slice(0, 900)}...and ${interaction.guild?.emojis.cache.map(e => e).join(', ').length - interaction.guild?.emojis.cache.map(e => e).join(', ').slice(0, 900).length} more` : interaction.guild?.emojis.cache.map(e => e).join(', ')}`, inline: false },
                            // show the animated emojis in the server and if too long show ...and {x} more
                            { name: await client.translate(`Animated emojis`, interaction.guild?.id), value: `${interaction.guild?.emojis.cache.filter(e => e.animated == true).map(e => e).join(', ').length > 900 ? `${interaction.guild?.emojis.cache.filter(e => e.animated == true).map(e => e).join(', ').slice(0, 900)}...and ${interaction.guild?.emojis.cache.filter(e => e.animated == true).map(e => e).join(', ').length - interaction.guild?.emojis.cache.filter(e => e.animated == true).map(e => e).join(', ').slice(0, 900).length} more` : interaction.guild?.emojis.cache.filter(e => e.animated == true).map(e => e).join(', ')}`, inline: false },
                        )
                        .setFooter({ text: await client.translate(`Requested by ${interaction.user.tag}`, interaction.guild?.id), iconURL: interaction.user.displayAvatarURL() })
                        .setTimestamp()

                        await interaction.editReply({ embeds: [embed] })
                    }
                    if((interaction.options as any).getSubcommand() == 'bans') {
                        await interaction.deferReply({ ephemeral: true })

                        const embed = new EmbedBuilder()
                        .setTitle(await client.translate(`Bans`, interaction.guild?.id))
                        .setColor(await interaction.client.embedColor(interaction.user))
                        .setDescription(await client.translate(`Bans: ${interaction.guild?.bans.cache.size}`, interaction.guild?.id))
                        .setFooter({ text: await client.translate(`Requested by ${interaction.user.tag}`, interaction.guild?.id), iconURL: interaction.user.displayAvatarURL() })
                        .setTimestamp()

                        await interaction.editReply({ embeds: [embed] })
                    }
                    if((interaction.options as any).getSubcommand() == 'members') {
                        await interaction.deferReply({ ephemeral: true })

                        const embed = new EmbedBuilder()
                        .setTitle(await client.translate(`Members`, interaction.guild?.id))
                        .setColor(await interaction.client.embedColor(interaction.user))
                        .setDescription(await client.translate(`Members: ${interaction.guild?.members.cache.size}`, interaction.guild?.id))
                        .setFooter({ text: await client.translate(`Requested by ${interaction.user.tag}`, interaction.guild?.id), iconURL: interaction.user.displayAvatarURL() })
                        .setTimestamp()

                        await interaction.editReply({ embeds: [embed] })
                    }
                }
                if((interaction.options as any).getSubcommandGroup() == 'premium') {
                    await interaction.deferReply({ ephemeral: true })
                    if((interaction.options as any).getSubcommand() == 'info') {
                    const user = (interaction.options as any).getUser('user') || null

                    if(user) {
                    const data = await PremiumUser.findOne({ userID: user.id })
                    let is_prem = await client.checkPremium(user.id)
                    if(is_prem == false) is_prem = await client.translate(`They don't have a premium subscription`, interaction.guild?.id)
                    if(is_prem == 'cactus_not_in_gu_ld') is_prem = await client.translate(`They aren't in my [support server](https://discord.gg/azury) so I can't calculate`, interaction.guild?.id)
                    if(is_prem == true) is_prem = await client.translate(`They have a premium subscription - expires <t:${Math.floor((ms(data.expires)) / 1000)}:R>`, interaction.guild?.id)
                    
                      return interaction.editReply({ embeds: [new EmbedBuilder()
                        .setTitle(await client.translate(`Premium`, interaction.guild?.id))
                        .setColor(await interaction.client.embedColor(interaction.user))
                        .setTimestamp()
                        .setFooter({ text: `Cactus Bot - UID: ${user.id}`, iconURL: interaction.client.user?.displayAvatarURL() })
                        .setDescription(`${is_prem}`)] })
                    } else {
                        return interaction.editReply({ embeds: [new EmbedBuilder()
                            .setTitle(await client.translate(`Premium`, interaction.guild?.id))
                            .setColor(await interaction.client.embedColor(interaction.user))
                            .setTimestamp()
                            .setFooter({ text: `Cactus Bot`, iconURL: interaction.client.user?.displayAvatarURL() })
                            .setDescription(await client.translate(`**What is premium?** Check out the pricing at [cactus.townbots.co](https://cactus.townbots.co/pricing.html)\n・Premium allows you to have access to special features for a cheap price`, interaction.guild?.id))] })
                        }  
                    }
                    if((interaction.options as any).getSubcommand() == 'redeem') {  
                        const code = (interaction.options as any).getString('code')

                        const dataCode = await PremiumCode.findOne({ code: code }) as any;
                        if(!dataCode) return await interaction.editReply({ content: `This is an Invalid Premium-Code! Please try again later!` })

                        const dataUser = await PremiumUser.findOne({ userID: interaction.user.id }) as any;
                        if(dataUser) return await interaction.editReply({ content: `You already have a premium subscription!` })

                        new PremiumUser({
                            userID: interaction.user.id,
                            expires: Date.now() + ms(dataCode.expires)
                        }).save();

                        await interaction.editReply({ content: `You have redeemed the code **${code}** which expires in ${dataCode.expires}!` });

                        await dataCode.delete();
                    }
                    if((interaction.options as any).getSubcommand() == 'create') { 
                        const expires = (interaction.options as any).getString('expires')
                        if(!client.config.Authentication.Engineers.includes(interaction.user?.id)) return interaction.editReply({ content: 'You do not have permission to use this command!' });

                        const code = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();

                        new PremiumCode({
                            code: code,
                            expires: expires
                        }).save()

                        await interaction.editReply({ content: `You have created a new Premium-Code with the ID **${code}**, which expires in ${expires}` })
                    }
                    if((interaction.options as any).getSubcommand() == 'list-codes') { 
                    if(!client.config.Authentication.Engineers.includes(interaction.user?.id)) return interaction.editReply({ content: 'You do not have permission to use this command!' });

                    const data = await PremiumCode.find({}) as any;
                    if(!data) return await interaction.editReply({ content: `There are no premium codes that are un-used!` })



                    // reply with the codesMap
                    await interaction.editReply({ content: data.map((code: any) => `**${code.code}** • Code-Duration: ${code.expires}`).join('\n') }).catch(() => {
                        interaction.editReply({ content: 'There are no premium codes that are un-used!' })
                    })
                    }
                }
                if((interaction.options as any).getSubcommand() == 'channelinfo') {
                        await interaction.deferReply({ ephemeral: true })

                        const channel = (interaction.options as any).getChannel('channel') as TextChannel

                        const embed = new EmbedBuilder()
                        .setAuthor({ name: await client.translate(`Info for`, interaction.guild?.id)+` ${channel.name}`, iconURL: interaction.guild?.iconURL() })
                        .setColor(await interaction.client.embedColor(interaction.user))
                        .setTimestamp()
                        .setFooter({ text: `Cactus Bot - CID: ${channel.id}`, iconURL: interaction.client.user?.displayAvatarURL() })
                        .addFields(
                        { name: await client.translate(`Name`, interaction.guild?.id), value: channel.name||await client.translate('No name', interaction.guild?.id), inline: true },
                        { name: await client.translate(`ID`, interaction.guild?.id), value: channel.id||await client.translate('No ID', interaction.guild?.id), inline: true },
                        { name: await client.translate(`Created at`, interaction.guild?.id), value: `<t:${Math.floor(channel.createdAt.getTime() / 1000)}:R>`, inline: true },
                        { name: await client.translate(`Type`, interaction.guild?.id), value: channel.type||await client.translate('No type', interaction.guild?.id), inline: true },
                        { name: await client.translate(`Topic`, interaction.guild?.id), value: channel.topic||await client.translate('No topic', interaction.guild?.id), inline: true },
                        { name: await client.translate(`NSFW`, interaction.guild?.id), value: channel.nsfw ? await client.translate('Yes', interaction.guild?.id) : await client.translate('No', interaction.guild?.id), inline: true },
                        { name: await client.translate(`Slowmode`, interaction.guild?.id), value: channel.rateLimitPerUser ? `${channel.rateLimitPerUser}` : await client.translate('No slowmode', interaction.guild?.id), inline: true },
                        { name: await client.translate(`Position`, interaction.guild?.id), value: channel.position ? `${channel.position}` : await client.translate('No position', interaction.guild?.id), inline: true },
                        { name: await client.translate(`Category`, interaction.guild?.id), value: channel.parent ? `${channel.parent}` : await client.translate('No category', interaction.guild?.id), inline: true },
                        { name: await client.translate(`Permissions`, interaction.guild?.id), value: channel.permissionsFor(interaction.guild?.roles.everyone)?.toArray().join(', ')||await client.translate('No permissions', interaction.guild?.id), inline: false },
                        )
                        await interaction.editReply({ embeds: [embed] })
                }
                if ((interaction.options as any).getSubcommand() == 'weatherinfo') {
                        await interaction.deferReply({ ephemeral: true })
                        const place = (interaction.options as any).getString('place') || 'Warsaw'

                        await interaction.editReply({ content: await client.translate(`Fetching weather info for`, interaction.guild?.id)+` ${place}...` })

                        const weather = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${interaction.client.config.Keys.Weather}&q=${place}&aqi=no`)
                        .then(res => res.data)
                        .catch(err => console.log(err))

                        if (!weather) return await interaction.editReply({ content: await client.translate(`I couldn't find weather info for`, interaction.guild?.id)+` ${place}!` })

                        const embed = new EmbedBuilder()
                        .setAuthor({ name: await client.translate(`Weather for`, interaction.guild?.id)+` ${weather.location.name}`, iconURL: interaction.guild?.iconURL() })
                        .setColor(await client.embedUrlColor(`https:`+weather.current.condition.icon))
                        .setTimestamp()
                        .setFooter({ text: `Cactus Bot - WID: ${weather.location.name}`, iconURL: interaction.user.displayAvatarURL() })
                        .addFields(
                            { name: await client.translate(`Temperature`, interaction.guild?.id), value: weather.current.temp_c ? `${weather.current.temp_c}°C / ${weather.current.temp_f}°F` : await client.translate(`No temperature`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Feels like`, interaction.guild?.id), value: weather.current.feelslike_c ? `${weather.current.feelslike_c}°C / ${weather.current.feelslike_f}°F` : await client.translate(`No feels like`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Humidity`, interaction.guild?.id), value: weather.current.humidity ? `${weather.current.humidity}%` : await client.translate(`No humidity`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Wind`, interaction.guild?.id), value: weather.current.wind_kph ? `${weather.current.wind_kph}km/h / ${weather.current.wind_mph}mph` : await client.translate(`No wind`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Wind direction`, interaction.guild?.id), value: weather.current.wind_dir ? `${weather.current.wind_dir}` : await client.translate(`No wind direction`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Cloud`, interaction.guild?.id), value: weather.current.cloud ? `${weather.current.cloud}%` : await client.translate(`No cloud`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Precipitation`, interaction.guild?.id), value: weather.current.precip_mm ? `${weather.current.precip_mm}mm / ${weather.current.precip_in}in` : await client.translate(`No precipitation`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Pressure`, interaction.guild?.id), value: weather.current.pressure_mb ? `${weather.current.pressure_mb}mb / ${weather.current.pressure_in}in` : await client.translate(`No pressure`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Last updated`, interaction.guild?.id), value: weather.current.last_updated ? `<t:${Math.floor(weather.current.last_updated_epoch)}:R>` : await client.translate(`No last updated`, interaction.guild?.id), inline: true },
                            )
                        .setThumbnail(`https:`+weather.current.condition.icon)

                        const row = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setLabel(await client.translate(`Refresh info state`, interaction.guild?.id))
                            .setCustomId('refresh_'+place)
                        )

                        const btnMsg = await interaction.editReply({ content: ` `, embeds: [embed], components: [row] })

                        const filter = (btn: any) => btn.user.id == interaction.user.id
                        const Collection = btnMsg.createMessageComponentCollector({ filter, time: 60000 })

                        Collection.on('collect', async (btn: any) => {
                            if(btn.customId.startsWith('refresh_')) {
                                const place = btn.customId.replace('refresh_', '')
                                await btn.deferUpdate()
                                const weather = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${interaction.client.config.Keys.Weather}&q=${place}&aqi=no`)
                        .then(res => res.data)
                        .catch(err => console.log(err))

                        const embed_refresh = new EmbedBuilder()
                        .setAuthor({ name: await client.translate(`Weather for`, interaction.guild?.id)+` ${weather.location.name}`, iconURL: interaction.guild?.iconURL() })
                        .setColor(await client.embedUrlColor(`https:`+weather.current.condition.icon))
                        .setTimestamp()
                        .setFooter({ text: `Cactus Bot - WID: ${weather.location.name}`, iconURL: interaction.user.displayAvatarURL() })
                        .addFields(
                            { name: await client.translate(`Temperature`, interaction.guild?.id), value: weather.current.temp_c ? `${weather.current.temp_c}°C / ${weather.current.temp_f}°F` : await client.translate(`No temperature`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Feels like`, interaction.guild?.id), value: weather.current.feelslike_c ? `${weather.current.feelslike_c}°C / ${weather.current.feelslike_f}°F` : await client.translate(`No feels like`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Humidity`, interaction.guild?.id), value: weather.current.humidity ? `${weather.current.humidity}%` : await client.translate(`No humidity`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Wind`, interaction.guild?.id), value: weather.current.wind_kph ? `${weather.current.wind_kph}km/h / ${weather.current.wind_mph}mph` : await client.translate(`No wind`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Wind direction`, interaction.guild?.id), value: weather.current.wind_dir ? `${weather.current.wind_dir}` : await client.translate(`No wind direction`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Cloud`, interaction.guild?.id), value: weather.current.cloud ? `${weather.current.cloud}%` : await client.translate(`No cloud`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Precipitation`, interaction.guild?.id), value: weather.current.precip_mm ? `${weather.current.precip_mm}mm / ${weather.current.precip_in}in` : await client.translate(`No precipitation`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Pressure`, interaction.guild?.id), value: weather.current.pressure_mb ? `${weather.current.pressure_mb}mb / ${weather.current.pressure_in}in` : await client.translate(`No pressure`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Last updated`, interaction.guild?.id), value: weather.current.last_updated ? `<t:${Math.floor(weather.current.last_updated_epoch)}:R>` : await client.translate(`No last updated`, interaction.guild?.id), inline: true },
                        )
                        .setThumbnail(`https:`+weather.current.condition.icon)

                                await interaction.editReply({ embeds: [embed_refresh] })
                            }
                        })

                        Collection.on('end', async () => {
                            const row = new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                .setStyle(Discord.ButtonStyle.Secondary)
                                .setLabel(await client.translate(`Refresh info state`, interaction.guild?.id))
                                .setCustomId('refresh')
                                .setDisabled(true)
                            )
                            await btnMsg.edit({ components: [row] })
                        })
                }
                if ((interaction.options as any).getSubcommand() == 'roleinfo') {
                        await interaction.deferReply({ ephemeral: true })
                        const role = (interaction.options as any).getRole('role') || interaction.guild?.roles.cache.find(r => r.name == 'everyone')

                        const functions = async (color: any) => {
                            if(color == '#000000') return await interaction.client.embedColor(interaction.user);
                            else return color;
                        }

                        const embed = new EmbedBuilder()
                        .setAuthor({ name: await client.translate(`Info for`, interaction.guild?.id)+` ${role?.name}`, iconURL: interaction.guild?.iconURL() })
                        .setColor(await functions(role?.hexColor))
                        .setTimestamp()
                        .setFooter({ text: `Cactus Bot - RID: ${role.id}`, iconURL: interaction.user.displayAvatarURL() })
                        .addFields(
                            { name: await client.translate(`Name`, interaction.guild?.id), value: role?.name ? `${role?.name}` : await client.translate(`No name`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Color`, interaction.guild?.id), value: role?.hexColor ? `${role?.hexColor}` : await client.translate(`No color`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Position`, interaction.guild?.id), value: role?.position ? `${role?.position}` : await client.translate(`No position`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Mentionable`, interaction.guild?.id), value: role?.mentionable ? `${role?.mentionable}` : await client.translate(`No mentionable`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Hoisted`, interaction.guild?.id), value: role?.hoist ? `${role?.hoist}` : await client.translate(`No hoisted`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Managed`, interaction.guild?.id), value: role?.managed ? `${role?.managed}` : await client.translate(`No managed`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Created at`, interaction.guild?.id), value: role?.createdAt ? `<t:${Math.floor(role?.createdAt.getTime() / 1000)}:F>` : await client.translate(`No created at`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Members`, interaction.guild?.id), value: role?.members ? `${role?.members.size}` : await client.translate(`No members`, interaction.guild?.id), inline: true },
                            { name: await client.translate(`Permissions`, interaction.guild?.id), value: role?.permissions ? `${role?.permissions.toArray().join(', ')||'No permissions'}` : await client.translate(`No permissions`, interaction.guild?.id), inline: true },
                        )

                        const row = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Secondary)
                            .setLabel(await client.translate(`Role-Widget`, interaction.guild?.id))
                            .setCustomId('role-widget')
                            .setDisabled(false)
                        )

                        const btnMSg = await interaction.editReply({ embeds: [embed], components: [row] })

                        const filter = (i: any) => i.customId == 'role-widget' && i.user.id == interaction.user.id
                        const collector = btnMSg.createMessageComponentCollector({ filter, time: 60000 })

                        collector.on('collect', async (i: any) => {
                            if(i.customId == 'role-widget') {
                                await i.deferReply({ ephemeral: true })
                                const canvas = Canvas.createCanvas(700, 100);
                                const ctx = canvas.getContext('2d');
                
                                ctx.fillStyle = `${role.hexColor}80`;
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                                ctx.beginPath();
                                ctx.moveTo(0, 0);
                                ctx.lineTo(0, 100);
                                ctx.lineTo(700, 100);
                                ctx.lineTo(700, 0);
                                ctx.lineTo(0, 0);
                                ctx.strokeStyle = `rgba(0, 0, 0, 0)`;
                                ctx.lineJoin = "round";
                                ctx.lineWidth = 40;
                                ctx.stroke();
                            
                                ctx.font = "40px sans-serif";
                                ctx.fillStyle = "#ffffff";
                                ctx.textAlign = "center";
                                ctx.textBaseline = "middle";
                                ctx.fillText(`${role.name}`, 350, 50);

                                const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), { name: "roleinfo.png" });

                                await i.editReply({ files: [attachment] })
                            }
                        })

                        collector.on('end', async () => {
                            const row = new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                .setStyle(Discord.ButtonStyle.Secondary)
                                .setLabel(await client.translate(`Role-Widget`, interaction.guild?.id))
                                .setCustomId('role-widget')
                                .setDisabled(true)
                            )
                            await btnMSg.edit({ components: [row] })
                        })
                }
                if ((interaction.options as any).getSubcommandGroup() == 'user') {
                    if((interaction.options as any).getSubcommand() == 'info') {
                        await interaction.deferReply({ ephemeral: true })
                        const user = (interaction.options as any).getUser('user') || interaction.user

                        const roles = ((interaction.options as any).getMember('user') || interaction.member).roles

                        
                        const functions = async (color: any) => {
                            if(color == '#000000') return await interaction.client.embedColor(interaction.user);
                            else return color;
                        }

                        const embed = new EmbedBuilder()
                        .setAuthor({ name: await client.translate(`Info for`, interaction.guild?.id)+` ${user.tag}`, iconURL: user.displayAvatarURL() })
                        .setColor(await functions(roles.highest.hexColor))
                        .setTimestamp()
                        .setFooter({ text: `Cactus Bot - UID: ${user.id}`, iconURL: interaction.client.user?.displayAvatarURL() })
                        .addFields(
                        { name: '\u200b', value: await client.translate(`**User info:**`, interaction.guild?.id) },
                        { name: await client.translate(`Username`, interaction.guild?.id), value: user.username, inline: true },
                        { name: await client.translate(`Discriminator`, interaction.guild?.id), value: user.discriminator, inline: true },
                        { name: await client.translate(`Bot`, interaction.guild?.id), value: user.bot ? 'True' : 'False', inline: true },
                        { name: await client.translate(`Created at`, interaction.guild?.id), value: `<t:${Math.floor(user.createdAt.getTime() / 1000)}:R>`, inline: true },
                        { name: await client.translate(`Avatar`, interaction.guild?.id), value: `[png](${user.displayAvatarURL({ format: 'png', dynamic: true })}) | [jpg](${user.displayAvatarURL({ format: 'jpg', dynamic: true })}) | [jpeg](${user.displayAvatarURL({ format: 'jpeg', dynamic: true })}) | [gif](${user.displayAvatarURL({ format: 'gif', dynamic: true })}) | [webp](${user.displayAvatarURL({ format: 'webp', dynamic: true })})`, inline: true },
                        { name: '\u200b', value: await client.translate(`**User roles/perms:**`, interaction.guild?.id) },
                        { name: await client.translate(`Roles`, interaction.guild?.id), value: roles.cache.size > 25 ? roles.cache.map((role: any) => `<@&${role.id}>`).slice(0, 25).join(', ') + ` and ${roles.cache.size - 25} more` : roles.cache.map((role: any) => `<@&${role.id}>`).join(', ').replace(/@@everyone/g, '') || await client.translate(`No roles`, interaction.guild?.id), inline: true },
                        { name: await client.translate(`Highest role`, interaction.guild?.id), value: roles.highest ? `<@&${roles.highest.id}>` : await client.translate(`No high role`, interaction.guild?.id), inline: false },
                        { name: await client.translate(`Permissions`, interaction.guild?.id), value: (interaction.member as any).permissions.toArray().length > 25 ? (interaction.member as any).permissions.toArray().slice(0, 25).join(', ') + ` and ${(interaction.member as any).permissions.toArray().length - 25} more` : (interaction.member as any).permissions.toArray().join(', ') || await client.translate(`No permissions`, interaction.guild?.id), inline: false },
                        )

                        await interaction.editReply({ embeds: [embed] })
                        }
                    if((interaction.options as any).getSubcommand() == 'invites') {
                        await interaction.deferReply({ ephemeral: true })
                        const user = (interaction.options as any).getUser('user') || interaction.user
                        const embed = new EmbedBuilder()
                        .setAuthor({ name: await client.translate(`Invites for`, interaction.guild?.id)+` ${user.tag}`, iconURL: user.displayAvatarURL() })
                        .setDescription(`<:reply_white:1078057903086374932> ${await client.translate(`Total`, interaction.guild?.id)}: *${await client.getInvites(user.id, interaction.guild?.id, 'total')} invites*`)
                        .setColor(await interaction.client.embedColor(user))
                        .setTimestamp()
                        .setFooter({ text: 'Cactus Bot', iconURL: interaction.client.user?.displayAvatarURL() })
                        .addFields({ name: '\u200b', value: await client.translate(`**Invite codes usage:**`, interaction.guild?.id) })
                        const invites = await interaction.guild?.invites.fetch()
                        const userInvites = invites?.filter((invite) => invite.inviter?.id == user.id)
                        userInvites?.map((invite: any) => {
                            embed.addFields({ name: invite.code, value: `*${invite.uses} uses*`, inline: true })
                        })

                        await interaction.editReply({ embeds: [embed] }) 
                    }
                    if((interaction.options as any).getSubcommand() == 'avatar') {
                        await interaction.deferReply({ ephemeral: true })
                        const user = (interaction.options as any).getUser('user') || interaction.user
                        const embed = new EmbedBuilder()
                        .setTitle(await client.translate(`Avatar for`, interaction.guild?.id)+` ${user.tag}`)
                        .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
                        .setColor(await interaction.client.embedColor(user))
                        .setTimestamp()
                        .setFooter({ text: 'Cactus Bot', iconURL: interaction.client.user?.displayAvatarURL() })

                        await interaction.editReply({ embeds: [embed] })
                    }
                    if((interaction.options as any).getSubcommand() == 'banner') {
                        await interaction.deferReply({ ephemeral: true })
                        const user = (interaction.options as any).getUser('user') || interaction.user
                        
                        // fetch the user's banner using discord raw api, using axios
                        const banner = await axios.get(`https://discord.com/api/v9/users/${user.id}`, {
                            headers: {
                                "Authorization": `Bot ${client.token}`
                            }
                        }).then((res) => res.data)

                        if(banner.banner) {
                        const embed = new EmbedBuilder()
                        .setTitle(await client.translate(`Banner for`, interaction.guild?.id)+` ${user.tag}`)
                        .setImage(`https://cdn.discordapp.com/banners/${user.id}/${banner.banner}.png?size=2048`)
                        .setColor(await interaction.client.embedColor(user))
                        .setTimestamp()

                        await interaction.editReply({ embeds: [embed] })
                        } else {
                            await interaction.editReply({ content: await client.translate(`This user doesn't have a banner`, interaction.guild?.id) })
                        }
                    }
                    if((interaction.options as any).getSubcommand() == 'badges') {
                        await interaction.deferReply({ ephemeral: true })
                        const user = (interaction.options as any).getUser('user') || interaction.user
                        const embed = new EmbedBuilder()
                        .setTitle(await client.translate(`Badges for`, interaction.guild?.id)+` ${user.tag}`)
                        .setDescription(await client.translate(`**Badges:**`, interaction.guild?.id)+` ${user.flags.toArray().length > 0 ? user.flags.toArray().join(', ') : await client.translate(`No badges`, interaction.guild?.id)}`)
                        .setColor(await interaction.client.embedColor(user))
                        .setTimestamp()
                        .setFooter({ text: 'Cactus Bot', iconURL: interaction.client.user?.displayAvatarURL() })

                        await interaction.editReply({ embeds: [embed] })
                    }
                    if((interaction.options as any).getSubcommand() == 'roles') {
                        await interaction.deferReply({ ephemeral: true })
                        const user = (interaction.options as any).getUser('user') || interaction.user
                        const member = await interaction.guild?.members.fetch(user.id)
                        const embed = new EmbedBuilder()
                        .setTitle(await client.translate(`Roles for`, interaction.guild?.id)+` ${user.tag}`)
                        .setDescription(member?.roles.cache.size > 25 ? member?.roles.cache.map((role: any) => `<@&${role.id}>`).slice(0, 25).join(', ') + ` and ${member?.roles.cache.size - 25} more` : member?.roles.cache.map((role: any) => `<@&${role.id}>`).join(', ').replace(/@@everyone/g, '') || await client.translate(`No roles`, interaction.guild?.id))
                        .setColor(await interaction.client.embedColor(user))
                        .setTimestamp()
                        .setFooter({ text: 'Cactus Bot', iconURL: interaction.client.user?.displayAvatarURL() })

                        await interaction.editReply({ embeds: [embed] })
                    }
                }
        if((interaction.options as any).getSubcommand() == 'help') {
            await interaction.deferReply({ ephemeral: true })
            
            // make a page for each command which name starts with info, admin, setup
            const pages = interaction.client.slashCommands.filter((command) => command.command.name.startsWith('info') || command.command.name.startsWith('admin') || command.command.name.startsWith('setup')).map(async(command) => {
                const embed = new EmbedBuilder()
                .setTitle(`**${command.command.name.toUpperCase()}** – \`${command.command.options.length} subcommands\``)
                .setDescription(command.command.description)
                .setColor(await interaction.client.embedColor(interaction.user))
                .setTimestamp()
                .setFooter({ text: 'Cactus Bot', iconURL: interaction.client.user?.displayAvatarURL() })
                .addFields(
                    { name: await client.translate(`Subcommands`, interaction.guild?.id), value: `\`/${command.command.name} ${command.command.options?.map((option: any) => option.required ? `<${option.name}>` : `[${option.name}]`).join(' ')}\``, inline: false },
                    { name: await client.translate(`Cooldown`, interaction.guild?.id), value: `\`${command.cooldown} seconds\``, inline: false },
                )
                return embed
            })

            const embed = new EmbedBuilder()
            .setTitle(await client.translate(`Help`, interaction.guild?.id))
            .setDescription(await client.translate(`Use the reactions to navigate through the pages.`, interaction.guild?.id))
            .setColor(await interaction.client.embedColor(interaction.user))
            .setTimestamp()
            .setFooter({ text: 'Cactus Bot', iconURL: interaction.client.user?.displayAvatarURL() })
            .addFields(
                { name: await client.translate(`Info`, interaction.guild?.id), value: await client.translate(`Shows info about the bot, the server, the user, etc.`, interaction.guild?.id), inline: false },
                { name: await client.translate(`Admin`, interaction.guild?.id), value: await client.translate(`Shows admin commands.`, interaction.guild?.id), inline: false },
                { name: await client.translate(`Setup`, interaction.guild?.id), value: await client.translate(`Shows setup commands.`, interaction.guild?.id), inline: false },
            )

            const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('previous')
                .setLabel(await client.translate(`Previous`, interaction.guild?.id))
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false),
                new ButtonBuilder()
                .setCustomId('next')
                .setLabel(await client.translate(`Next`, interaction.guild?.id))
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false),
            )

            const message = await interaction.editReply({ embeds: [embed], components: [row] })
            const filter = (button: ButtonInteraction) => button.user.id == interaction.user.id;
            const collector = (message as any).createMessageComponentCollector(filter, { time: 60000 });

            let page = 0;
            collector.on('collect', async (button: ButtonInteraction) => {
                if(button.customId == 'next') {
                    page++;
                    if(page > pages.length - 1) page = 0;
                    await button.update({ embeds: [await pages[page]], components: [row] })
                }
                if(button.customId == 'previous') {
                    page--;
                    if(page < 0) page = pages.length - 1;
                    await button.update({ embeds: [await pages[page]], components: [row] })
                }
            })

            collector.on('end', async () => {
                await interaction.editReply({ components: [] })
            })

        }
        if ((interaction.options as any).getSubcommand() == 'botstats') {
            await interaction.deferReply({ ephemeral: true })

            const embed = new EmbedBuilder()
            .setTitle(await client.translate(`Bot stats of`, interaction.guild?.id)+` ${interaction.client.user?.tag}`)
            .setColor(await interaction.client.embedColor(interaction.user))
            .addFields(
                { name: await client.translate(`Guilds`, interaction.guild?.id), value: `${interaction.client.guilds.cache.size}`, inline: true },
                { name: await client.translate(`Users`, interaction.guild?.id), value: `${interaction.client.users.cache.size}`, inline: true },
                { name: await client.translate(`Channels`, interaction.guild?.id), value: `${interaction.client.channels.cache.size}`, inline: true },
                { name: await client.translate(`Commands`, interaction.guild?.id), value: `${interaction.client.slashCommands.size}`, inline: true },
                { name: await client.translate(`Uptime`, interaction.guild?.id), value: `${ms(interaction.client.uptime as number, { long: true })}`, inline: true },
                { name: await client.translate(`Ping`, interaction.guild?.id), value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true },
                { name: await client.translate(`Memory`, interaction.guild?.id), value: `${(process.memoryUsage().heapUsed / 900 / 900).toFixed(2)}MB`, inline: true },
                { name: await client.translate(`Node`, interaction.guild?.id), value: `${process.version}`, inline: true },
                { name: await client.translate(`Discord.js`, interaction.guild?.id), value: `${Discord.version}`, inline: true },
                { name: await client.translate(`OS`, interaction.guild?.id), value: `${process.platform}`, inline: true },
                { name: await client.translate(`CPU`, interaction.guild?.id), value: `${os.cpus()[0].model}`, inline: true },
                { name: await client.translate(`CPU Cores`, interaction.guild?.id), value: `${os.cpus().length}`, inline: true },
                { name: await client.translate(`CPU Speed`, interaction.guild?.id), value: `${os.cpus()[0].speed}MHz`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'Cactus Bot', iconURL: interaction.client.user?.displayAvatarURL() })

interaction.editReply({ embeds: [embed] })

        } 
        if ((interaction.options as any).getSubcommand() == 'invite') {
            await interaction.deferReply({ ephemeral: true })

            const embed = new EmbedBuilder()
            .setTitle(await client.translate(`Invite`, interaction.guild?.id))
            .setDescription(await client.translate(`You can invite the bot with this [link](`, interaction.guild?.id)+` https://discord.com/oauth2/authorize?client_id=${interaction.client.user.id}&scope=applications.commands%20bot&permissions=8]`)
            .setColor(await interaction.client.embedColor(interaction.user))
            .setTimestamp()
            .setFooter({ text: 'Cactus Bot', iconURL: interaction.client.user?.displayAvatarURL() })

            interaction.editReply({ embeds: [embed] })
        }
        if ((interaction.options as any).getSubcommand() == 'guide') {
            await interaction.deferReply({ ephemeral: true })
            
            const page1 = new Discord.EmbedBuilder()
            .setTitle(await client.translate('Guide', interaction.guild?.id))
            .addFields(
                { name: '**Prefix**', value: 'The prefix for the bot is `/`'}
            )
            .setFooter({ text: 'Page 1/2' })
            .setColor('#00FF00')

            const page2 = new Discord.EmbedBuilder()
            .setTitle(await client.translate('Guide', interaction.guild?.id))
            .addFields(
                { name: '**Administration**', value: 'You can manage your server\'s settings with the </admin:1076863562795982898> command.'},
            )
            .setFooter({ text: 'Page 2/2' })
            .setColor('#00FF00')

            const pages = [page1, page2]

            const button1 = new Discord.ButtonBuilder()
            .setCustomId('previous')
            .setEmoji(`1071622043646300240`)
            .setLabel(await client.translate('Previous', interaction.guild?.id))
            .setStyle(Discord.ButtonStyle.Primary)

            const button2 = new Discord.ButtonBuilder()
            .setCustomId('next')
            .setEmoji(`1071621928382640238`)
            .setLabel(await client.translate('Next', interaction.guild?.id))
            .setStyle(Discord.ButtonStyle.Primary)

 
            const buttons = [button1, button2]

            const buttonMessage = await interaction.editReply({ embeds: [page1], components: [new Discord.ActionRowBuilder<ButtonBuilder>().addComponents(buttons)] })
            
            pagesystem(interaction, buttonMessage, pages, buttons)
        }
    }
}

export default command