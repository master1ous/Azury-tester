import { Client, AuditLogEvent, Guild, Events, GuildAuditLogsEntry, ColorResolvable, InteractionCollector, MembershipScreeningFieldType, ButtonBuilder, ButtonStyle } from "discord.js";
import Discord from "discord.js";
import { BotEvent } from "../types";
import { color } from "../functions";
import SettingsModule from "../schemas/Settings";

const event : BotEvent = {
    name: "ready",
    once: true,
    execute: async (client : Client) => {

        client.on("messageCreate", async (message: any) => {
            const isInvite = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+/.test(message.content);
            if(isInvite){
                const invite = await (client.fetchInvite(message.content.split("discord.gg/")[1]) as any).catch(() => {return});
                if(!invite) return;
                const embed = new Discord.EmbedBuilder()
                .setColor(await message.client.embedColor(message.author))
                .setAuthor({ name: "Invite Detected", iconURL: message.author.avatarURL() })
                .setDescription(`Posted <t:${Math.floor(message.createdTimestamp / 1000)}:R>`)
                .addFields(
                    { name: "Author", value: message.author.tag, inline: true },
                    { name: "Channel", value: message.channel.toString(), inline: true },
                    { name: "Server", value: invite.guild.name, inline: true },
                    { name: "Members", value: invite.guild.memberCount ? invite.guild.memberCount.toString() : 'Not able to determine', inline: true },
                )
                .setTimestamp()

                const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Join guild")
                    .setURL(`https://discord.gg/${invite.code}`),
                    new Discord.ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Message")
                    .setURL(`https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)
                )

                await sendAudit(message.guild, embed, row)
            }
        })

        client.on("voiceStateUpdate", async (oldState: any, newState: any) => {
            if(oldState.channelId == newState.channelId) return;
            if(!oldState.channelId && newState.channelId){
                const embed = new Discord.EmbedBuilder()
                .setColor(await newState.client.embedColor(newState.member.user))
                .setAuthor({ name: "Voice Channel Join", iconURL: newState.member.user.avatarURL() })
                .addFields(
                    { name: "Member", value: newState.member.user.tag, inline: true },
                    { name: "Channel", value: newState.channel.toString(), inline: true },
                )
                .setTimestamp()

                await sendAudit(newState.guild, embed)
            }
        })

        client.on("voiceStateUpdate", async (oldState: any, newState: any) => {
            if(oldState.channelId == newState.channelId) return;
            if(oldState.channelId && !newState.channelId){
                const embed = new Discord.EmbedBuilder()
                .setColor(await newState.client.embedColor(newState.member.user))
                .setAuthor({ name: "Voice Channel Leave", iconURL: newState.member.user.avatarURL() })
                .addFields(
                    { name: "Member", value: newState.member.user.tag, inline: true },
                    { name: "Channel", value: oldState.channel.toString(), inline: true },
                )
                .setTimestamp()

                await sendAudit(newState.guild, embed)
            }
        })

        client.on("messageDeleteBulk", async (messages: any) => {
            const fetchedLogs = await messages.first().guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MessageBulkDelete,
            });
            const deletionLog = fetchedLogs.entries.first();
            const embed = new Discord.EmbedBuilder()
            .setColor(await messages.first().client.embedColor(messages.first().author))
            .setAuthor({ name: "Bulk Message Delete", iconURL: messages.first().author.avatarURL() })
            .addFields(
                { name: "Executor", value: deletionLog?.executor?.tag || "Unknown"},
                { name: "Channel", value: messages.first().channel.toString(), inline: true },
                { name: "Messages", value: messages.size.toString(), inline: true }
            )
            .setTimestamp()

            await sendAudit(messages.first().guild, embed)
        })

        client.on("messageDelete", async (message: any) => {
            const fetchedLogs = await message.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MessageDelete,
            });
            if(message.author.bot) return;
            if(message.content == "") return;
            const deletionLog = fetchedLogs.entries.first();
            const embed = new Discord.EmbedBuilder()
            .setColor(await message.client.embedColor(message.author))
            .setAuthor({ name: "Message Deleted", iconURL: message.author.avatarURL() })
            .setDescription(`Created <t:${Math.floor(message.createdTimestamp / 1000)}:R>`)
            .addFields(
                { name: "Executor", value: deletionLog?.executor?.tag || "Unknown"},
                { name: "Author", value: message.author.tag, inline: true },
                { name: "Channel", value: message.channel.toString(), inline: true },
                { name: "Message", value: message.content, inline: false }
            )
            .setTimestamp()

            await sendAudit(message.guild, embed)
        })

        client.on("messageUpdate", async (oldMessage: any, newMessage: any) => {
            if(oldMessage.author.bot) return;
            if(oldMessage.content == newMessage.content) return;
            const isInvite = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+/.test(newMessage.content);
            if(isInvite){
                const invite = await (client.fetchInvite(newMessage.content.split("discord.gg/")[1]) as any).catch(async() => {const embed = new Discord.EmbedBuilder()
                    .setColor(await oldMessage.client.embedColor(oldMessage.author))
                    .setAuthor({ name: "Message Edited", iconURL: oldMessage.author.avatarURL() })
                    .setDescription(`[[Jump to Message]](${newMessage.url}) ~ ***Edited <t:${Math.floor(newMessage.editedTimestamp / 1000)}:R>***`)
                    .addFields(
                        { name: "Author", value: oldMessage.author.tag, inline: true },
                        { name: "Channel", value: oldMessage.channel.toString(), inline: true },
                        { name: "Old Message", value: oldMessage.content, inline: false },
                        { name: "New Message", value: newMessage.content, inline: false }
                    )
                    .setTimestamp()
                    .setFooter({ text: `ID: ${oldMessage.id}` })
                    await sendAudit(oldMessage.guild, embed)
                return});
                
                const embed = new Discord.EmbedBuilder()
                .setColor(await newMessage.client.embedColor(newMessage.author))
                .setAuthor({ name: "Invite Detected", iconURL: newMessage.author.avatarURL() })
                .setDescription(`Edited <t:${Math.floor(newMessage.editedTimestamp / 1000)}:R>`)
                .addFields(
                    { name: "Author", value: oldMessage.author.tag, inline: true },
                    { name: "Channel", value: oldMessage.channel.toString(), inline: true },
                    { name: "Server", value: invite.guild.name, inline: true },
                    { name: "Members", value: invite.guild.memberCount ? invite.guild.memberCount.toString() : 'Not able to determine', inline: true },
                )
                .setTimestamp()

                const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Join guild")
                    .setURL(`https://discord.gg/${invite.code}`),
                    new Discord.ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Message")
                    .setURL(`https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id}`)
                )

                await sendAudit(oldMessage.guild, embed, row)
                return
            }
            const embed = new Discord.EmbedBuilder()
            .setColor(await oldMessage.client.embedColor(oldMessage.author))
            .setAuthor({ name: "Message Edited", iconURL: oldMessage.author.avatarURL() })
            .setDescription(`[[Jump to Message]](${newMessage.url}) ~ ***Edited <t:${Math.floor(newMessage.editedTimestamp / 1000)}:R>***`)
            .addFields(
                { name: "Author", value: oldMessage.author.tag, inline: true },
                { name: "Channel", value: oldMessage.channel.toString(), inline: true },
                { name: "Old Message", value: oldMessage.content, inline: false },
                { name: "New Message", value: newMessage.content, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${oldMessage.id}` })
            await sendAudit(oldMessage.guild, embed)
        })

        client.on("channelCreate", async (channel: any) => {
            const fetchedLogs = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.ChannelCreate,
            });
            const embed = new Discord.EmbedBuilder()
            .setColor(await channel.client.embedUrlColor(channel.guild.iconURL()))
            .setTitle("Channel Created")
            .setDescription(`[[Jump to Channel]](${channel.url}) ~ ***Created <t:${Math.floor(channel.createdTimestamp / 1000)}:R>***`)
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.tag || "Unknown"},
                { name: "Channel", value: channel.toString(), inline: true },
                { name: "Type", value: channel.type, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${channel.id}` })
            await sendAudit(channel.guild, embed)
        })

        client.on("channelDelete", async (channel: any) => {
            const fetchedLogs = await channel.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.ChannelDelete,
            });
            const embed = new Discord.EmbedBuilder()
            .setColor(await channel.client.embedUrlColor(channel.guild.iconURL()))
            .setTitle("Channel Deleted")
            .setDescription(`Created <t:${Math.floor(channel.createdTimestamp / 1000)}:R>`)
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.tag || "Unknown"},
                { name: "Channel", value: channel.toString(), inline: true },
                { name: "Type", value: `${channel.type}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${channel.id}` })
            await sendAudit(channel.guild, embed)
        })

        client.on("channelUpdate", async (oldChannel: any, newChannel: any) => {
            if(oldChannel.name == newChannel.name) return;
            const fetchedLogs = await oldChannel.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.ChannelUpdate,
            });
            const embed = new Discord.EmbedBuilder()
            .setColor(await oldChannel.client.embedUrlColor(oldChannel.guild.iconURL()))
            .setTitle("Channel Updated")
            .setDescription(`[[Jump to Channel]](${newChannel.url}) ~ ***Updated <t:${Math.floor(newChannel.createdTimestamp / 1000)}:R>***`)
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.tag || "Unknown"},
                { name: "Channel", value: newChannel.toString(), inline: true },
                { name: "Type", value: `${oldChannel.type}`, inline: true },
                { name: "Old Name", value: oldChannel.name, inline: true },
                { name: "New Name", value: newChannel.name, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${oldChannel.id}` })
            await sendAudit(oldChannel.guild, embed)
        })

        client.on("guildMemberUpdate", async (oldMember: any, newMember: any) => {
            if(oldMember.nickname == newMember.nickname) return;
            const fetchedLogs = await oldMember.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberUpdate,
            });
            const embed = new Discord.EmbedBuilder()
            .setColor(await oldMember.client.embedColor(newMember.user))
            .setAuthor({ name: newMember.user.username+` - Nickname`, iconURL: newMember.user.avatarURL() })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.tag || "Unknown"},
                { name: "Member", value: oldMember.user.tag, inline: true },
                { name: "Old Nickname", value: oldMember.nickname || "None", inline: true },
                { name: "New Nickname", value: newMember.nickname || "None", inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${oldMember.id}` })
            await sendAudit(oldMember.guild, embed)
        })

        client.on("userUpdate", async (oldUser: any, newUser: any) => {
            if(oldUser.username == newUser.username) return;
            const embed = new Discord.EmbedBuilder()
            .setColor(await oldUser.client.embedColor(newUser.user))
            .setAuthor({ name: newUser.user.username+` - Username`, iconURL: newUser.user.avatarURL() })
            .addFields(
                { name: "Member", value: oldUser.tag, inline: true },
                { name: "Old Username", value: oldUser.username, inline: true },
                { name: "New Username", value: newUser.username, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${oldUser.id}` })
            await sendAudit(oldUser.guild, embed)
        })

        client.on("guildMemberUpdate", async (oldMember: any, newMember: any) => {
            if(oldMember.roles.cache.size == newMember.roles.cache.size) return;
            const fetchedLogs = await oldMember.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberRoleUpdate,
            });
            const embed = new Discord.EmbedBuilder()
            .setColor(await oldMember.client.embedColor(newMember.user))
            .setAuthor({ name: newMember.user.username+` - Roles`, iconURL: newMember.user.avatarURL() })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.tag || "Unknown"},
                { name: "Member", value: oldMember.user.tag, inline: true },
                { name: "Added Roles", value: newMember.roles.cache.filter((r: any) => !oldMember.roles.cache.has(r.id)).map((r: any) => r).join(", ") || "None", inline: false },
                { name: "Removed Roles", value: oldMember.roles.cache.filter((r: any) => !newMember.roles.cache.has(r.id)).map((r: any) => r).join(", ") || "None", inline: false }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${oldMember.id}` })
            await sendAudit(oldMember.guild, embed)
        })

        client.on("guildMemberAdd", async (member: any) => {
            const embed = new Discord.EmbedBuilder()
            .setColor(await member.client.embedColor(member.user))
            .setAuthor({ name: member.user.username+` - Joined`, iconURL: member.user.displayAvatarURL() })
            .addFields(
                { name: "Member", value: member.user.tag, inline: true },
                { name: "Account Created", value: member.user.createdAt.toDateString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${member.id}` })
            await sendAudit(member.guild, embed)
        })

        client.on("guildMemberRemove", async (member: any) => {
            const embed = new Discord.EmbedBuilder()
            .setColor(await member.client.embedColor(member.user))
            .setAuthor({ name: member.user.username+` - Left`, iconURL: member.user.displayAvatarURL() })
            .addFields(
                { name: "Member", value: member.user.tag, inline: true },
                { name: "Account Created", value: member.user.createdAt.toDateString(), inline: true },
                { name: "Joined", value: member.joinedAt.toDateString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${member.id}` })
            await sendAudit(member.guild, embed)
        })

        client.on("guildBanAdd", async (member: any) => {
            const fetchedLogs = await member.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberBanAdd,
            });
            const embed = new Discord.EmbedBuilder()
            .setColor(await member.client.embedColor(member.user))
            .setAuthor({ name: member.user.username+` - Banned`, iconURL: member.user.displayAvatarURL() })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.tag || "Unknown"},
                { name: "Member", value: member.user.tag, inline: true },
                { name: "Account Created", value: member.user.createdAt.toDateString(), inline: true },
                { name: "Joined", value: member.joinedAt.toDateString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${member.id}` })
            await sendAudit(member.guild, embed)
        })

        client.on("guildBanRemove", async (member: any) => {
            const fetchedLogs = await member.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberBanRemove,
            });
            const embed = new Discord.EmbedBuilder()
            .setColor(await member.client.embedColor(member.user))
            .setAuthor({ name: member.user.username+` - Unbanned`, iconURL: member.user.displayAvatarURL() })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.tag || "Unknown"},
                { name: "Member", value: member.user.tag, inline: true },
                { name: "Account Created", value: member.user.createdAt.toDateString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${member.id}` })
            await sendAudit(member.guild, embed)
        })

        client.on("emojiCreate", async (emoji: any) => {
            const fetchedLogs = await emoji.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.EmojiCreate,
            });
            const embed = new Discord.EmbedBuilder()
            .setColor(await emoji.client.embedUrlColor(emoji.url))
            .setTitle("Emoji Created - " + emoji.name)
            .setDescription(`[[Jump to Emoji]](${emoji.url}) ~ [Download](${emoji.url}) ~ ***Created <t:${Math.floor(emoji.createdTimestamp / 1000)}:R>***`)
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.tag || "Unknown"},
                { name: "Emoji", value: emoji.toString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${emoji.id}` })
            await sendAudit(emoji.guild, embed)
        })

        client.on("emojiDelete", async (emoji: any) => {
            const fetchedLogs = await emoji.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.EmojiDelete,
            });
            const embed = new Discord.EmbedBuilder()
            .setColor(await emoji.client.embedUrlColor(emoji.url))
            .setTitle("Emoji Deleted - " + emoji.name)
            .setDescription(`[Download](${emoji.url}) ~ Created <t:${Math.floor(emoji.createdTimestamp / 1000)}:R>`)
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.tag || "Unknown"},
                { name: "Emoji", value: emoji.toString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${emoji.id}` })
            await sendAudit(emoji.guild, embed)
        })

        client.on("emojiUpdate", async (oldEmoji: any, newEmoji: any) => {
            const fetchedLogs = await oldEmoji.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.EmojiUpdate,
            });
            const embed = new Discord.EmbedBuilder()
            .setColor(await oldEmoji.client.embedUrlColor(newEmoji.url))
            .setTitle("Emoji Updated - " + oldEmoji.name + " -> " + newEmoji.name)
            .setDescription(`[Download](${newEmoji.url}) ~ ***Updated <t:${Math.floor(newEmoji.createdTimestamp / 1000)}:R>***`)
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.tag || "Unknown"},
                { name: "Emoji", value: oldEmoji.toString(), inline: true },
                { name: "Old Name", value: oldEmoji.name, inline: true },
                { name: "New Name", value: newEmoji.name, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${oldEmoji.id}` })
            await sendAudit(oldEmoji.guild, embed)
        })

        client.on("roleCreate", async (role: any) => {
            const fetchedLogs = await role.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.RoleCreate,
            });
            const embed = new Discord.EmbedBuilder()
            .setColor(await role.hexColor)
            .setTitle("Role Created - " + role.name)
            .setDescription(`***Created <t:${Math.floor(role.createdTimestamp / 1000)}:R>***`)
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.tag || "Unknown"},
                { name: "Role", value: role.toString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${role.id}` })
            await sendAudit(role.guild, embed)
        })

        client.on("roleDelete", async (role: any) => {
            const fetchedLogs = await role.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.RoleDelete,
            });
            const embed = new Discord.EmbedBuilder()
            .setColor(await role.hexColor)
            .setTitle("Role Deleted - " + role.name)
            .setDescription(`Created <t:${Math.floor(role.createdTimestamp / 1000)}:R>`)
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.tag || "Unknown"},
                { name: "Role", value: role.toString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${role.id}` })
            await sendAudit(role.guild, embed)
        })

        client.on("roleUpdate", async (oldRole: any, newRole: any) => {
            const fetchedLogs = await oldRole.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.RoleUpdate,
            });
            const embed = new Discord.EmbedBuilder()
            .setColor(await newRole.hexColor)
            .setTitle("Role Updated - " + oldRole.name + " -> " + newRole.name)
            .setDescription(`***Updated <t:${Math.floor(newRole.createdTimestamp / 1000)}:R>***`)
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.tag || "Unknown"},
                { name: "Role", value: oldRole.toString(), inline: true },
                { name: "Old Name", value: oldRole.name, inline: true },
                { name: "New Name", value: newRole.name, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${oldRole.id}` })
            await sendAudit(oldRole.guild, embed)
        })

    }
}

export default event;

async function sendAudit(guild:any, embed: any, row: any = null) {
    const data = await SettingsModule.findOne({ guildID: guild.id })
    if(!data) return;
    if(data.audit[0]){
        if(data.audit[0].enabled == false) return;
        const channel = guild.channels.cache.get(data.audit[0].channel)
        if(!channel) return;
        if(row == null) {
            (channel as any).send({ embeds: [embed] })
            return;
        }
        (channel as any).send({ embeds: [embed], components: [row] })
    }
}
