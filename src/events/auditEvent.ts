import { Client, AuditLogEvent, Guild, Events, GuildAuditLogsEntry, ColorResolvable, InteractionCollector, MembershipScreeningFieldType, ButtonBuilder, ButtonStyle } from "discord.js";
import Discord from "discord.js";
import { BotEvent } from "../types";
import { color } from "../functions";
import SettingsModule from "../schemas/Settings";
import { channel } from "diagnostics_channel";

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
                .setColor(`DarkGreen` as ColorResolvable)
                .setAuthor({ name: "Invite Detected", iconURL: message.author.avatarURL() })
                .setDescription(`Posted <t:${Math.floor(message.createdTimestamp / 1000)}:R>`)
                .addFields(
                    { name: "Author", value: message.author.toString(), inline: true },
                    { name: "Channel", value: message.channel.toString(), inline: true },
                    { name: "Server", value: invite.guild.name, inline: true },
                    { name: "Members", value: invite.guild.memberCount ? invite.guild?.memberCount.toString() : 'Not able to determine', inline: true },
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
                .setColor(`Green` as ColorResolvable)
                .setAuthor({ name: "Voice Channel Join", iconURL: newState.member.user.avatarURL() })
                .addFields(
                    { name: "Member", value: newState.member.user.toString(), inline: true },
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
                .setColor(`Red` as ColorResolvable)
                .setAuthor({ name: "Voice Channel Leave", iconURL: newState.member.user.avatarURL() })
                .addFields(
                    { name: "Member", value: newState.member.user.toString(), inline: true },
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
            .setColor(`DarkRed` as ColorResolvable)
            .setAuthor({ name: "Bulk Message Delete", iconURL: messages.first().author.avatarURL() })
            .addFields(
                { name: "Executor", value: deletionLog?.executor?.toString() || "Unknown", inline: true},
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
            .setColor(`Red` as ColorResolvable)
            .setAuthor({ name: "Message Deleted", iconURL: message.author.avatarURL() })
            .addFields(
                { name: "Author", value: message.author.toString(), inline: true },
                { name: "Channel", value: message.channel.toString(), inline: true },
                { name: "Message", value: message.content, inline: false }
            )
            .setTimestamp()

            await sendAudit(message.guild, embed)
        })

        client.on("messageUpdate", async (oldMessage: any, newMessage: any) => {
            if(newMessage.author.bot) return;
            if(oldMessage.content == newMessage.content) return;
            const isInvite = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+/.test(newMessage.content);
            if(isInvite){
                const invite = await (client.fetchInvite(newMessage.content.split("discord.gg/")[1]) as any).catch(async() => {const embed = new Discord.EmbedBuilder()
                    .setColor(`DarkGold` as ColorResolvable)
                    .setAuthor({ name: "Message Edited", iconURL: oldMessage.author.avatarURL(), url: newMessage.url })
                    .addFields(
                        { name: "Author", value: oldMessage.author.toString(), inline: true },
                        { name: "Channel", value: oldMessage.channel.toString(), inline: true },
                        { name: "Old Message", value: oldMessage.content, inline: false },
                        { name: "New Message", value: newMessage.content, inline: false }
                    )
                    .setTimestamp()
                    .setFooter({ text: `ID: ${oldMessage.id}` })
                    await sendAudit(oldMessage.guild, embed)
                return});
                
                const embed = new Discord.EmbedBuilder()
                .setColor(`DarkGold` as ColorResolvable)
                .setAuthor({ name: "Invite Detected", iconURL: newMessage.author.avatarURL() })
                .addFields(
                    { name: "Author", value: oldMessage.author.toString(), inline: true },
                    { name: "Channel", value: oldMessage.channel.toString(), inline: true },
                    { name: "Server", value: invite.guild.name, inline: true },
                    { name: "Members", value: invite.guild.memberCount ? invite.guild?.memberCount.toString() : 'Not able to determine', inline: true },
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
            .setColor(`DarkGold` as ColorResolvable)
            .setAuthor({ name: "Message Edited", iconURL: oldMessage.author.avatarURL(), url: newMessage.url })
            .addFields(
                { name: "Author", value: oldMessage.author.toString(), inline: true },
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
            .setColor(`DarkGreen` as ColorResolvable)
            .setAuthor({ name: "Channel Created", iconURL: channel.guild.iconURL(), url: `https://discord.com/channels/${channel.guild.id}/${channel.id}` })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.toString() || "Unknown", inline: true},
                { name: "Channel", value: channel.toString(), inline: true },
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
            .setColor(`DarkRed` as ColorResolvable)
            .setAuthor({ name: "Channel Deleted", iconURL: channel.guild.iconURL(), url: `https://discord.com/channels/${channel.guild.id}/${channel.id}` })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.toString() || "Unknown", inline: true},
                { name: "Channel", value: channel.name, inline: true },
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
            if(oldChannel.name !== newChannel.name) {
            const embed = new Discord.EmbedBuilder()
            .setColor(`DarkGold` as ColorResolvable)
            .setAuthor({ name: "Channel Name Updated", iconURL: oldChannel.guild.iconURL(), url: `https://discord.com/channels/${oldChannel.guild.id}/${oldChannel.id}` })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.toString() || "Unknown", inline: true},
                { name: "Channel", value: newChannel.toString(), inline: true },
                { name: "Old Name", value: oldChannel.name, inline: true },
                { name: "New Name", value: newChannel.name, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${oldChannel.id}` })
            await sendAudit(oldChannel.guild, embed)
            }
            if(oldChannel.permissions !== newChannel.permissions) {
                const embed = new Discord.EmbedBuilder()
                .setColor(`DarkGold` as ColorResolvable)
                .setAuthor({ name: "Channel Permissions Updated", iconURL: oldChannel.guild.iconURL(), url: `https://discord.com/channels/${oldChannel.guild.id}/${oldChannel.id}` })
                .addFields(
                    { name: "Executor", value: fetchedLogs.entries.first()?.executor?.toString() || "Unknown", inline: true},
                    { name: "Channel", value: newChannel.toString(), inline: true },
                    { name: "New Permissions", value: newChannel.permissionOverwrites.map((p: any) => p.toString()).join(", "), inline: false }
                )
                .setTimestamp()
                .setFooter({ text: `ID: ${oldChannel.id}` })
                await sendAudit(oldChannel.guild, embed)
            }
        })

        client.on("guildMemberUpdate", async (oldMember: any, newMember: any) => {
            if(oldMember.nickname == newMember.nickname) return;
            const fetchedLogs = await oldMember.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberUpdate,
            });
            if(oldMember.nickname !== newMember.nickname) {
            const embed = new Discord.EmbedBuilder()
            .setColor(`DarkGold` as ColorResolvable)
            .setAuthor({ name: `User Nickname Changed`, iconURL: newMember.user.avatarURL(), url: `https://discord.com/users/${newMember.id}` })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.toString() || "Unknown", inline: true},
                { name: "Member", value: oldMember.user.toString(), inline: true },
                { name: "Old Nickname", value: oldMember.nickname || "None", inline: true },
                { name: "New Nickname", value: newMember.nickname || "None", inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${oldMember.id}` })
            await sendAudit(oldMember.guild, embed)
            }
        })

        client.on("userUpdate", async (oldUser: any, newUser: any) => {
            if(oldUser.username == newUser.username) return;
            const embed = new Discord.EmbedBuilder()
            .setColor(`DarkGold` as ColorResolvable)
            .setAuthor({ name: `User Username Changed`, iconURL: newUser.user.avatarURL(), url: `https://discord.com/users/${newUser.id}` })
            .addFields(
                { name: "Member", value: oldUser.toString(), inline: true },
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
            if(oldMember.roles.cache.size !== newMember.roles.cache.size) {
            const embed = new Discord.EmbedBuilder()
            .setColor(`DarkGold` as ColorResolvable)
            .setAuthor({ name: `User Roles Changed`, iconURL: newMember.user.avatarURL() })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.toString() || "Unknown", inline: true},
                { name: "Member", value: oldMember.user.toString(), inline: true },
                { name: "Added Roles", value: newMember.roles.cache.filter((r: any) => !oldMember.roles.cache.has(r.id)).map((r: any) => r).join(", ") || "None", inline: false },
                { name: "Removed Roles", value: oldMember.roles.cache.filter((r: any) => !newMember.roles.cache.has(r.id)).map((r: any) => r).join(", ") || "None", inline: false }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${oldMember.id}` })
            await sendAudit(oldMember.guild, embed)
            }
        })

        client.on("guildMemberAdd", async (member: any) => {
            const embed = new Discord.EmbedBuilder()
            .setColor(`Green` as ColorResolvable)
            .setAuthor({ name: `User Server Joined`, iconURL: member.user.displayAvatarURL() })
            .addFields(
                { name: "Member", value: member.user.toString(), inline: true },
                { name: "Account Created", value: member.user.createdAt.toDateString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${member.id}` })
            await sendAudit(member.guild, embed)
        })

        client.on("guildMemberRemove", async (member: any) => {
            const embed = new Discord.EmbedBuilder()
            .setColor(`Red` as ColorResolvable)
            .setAuthor({ name: `User Server Left`, iconURL: member.user.displayAvatarURL() })
            .addFields(
                { name: "Member", value: member.user.toString(), inline: true },
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
            .setColor(`DarkGreen` as ColorResolvable)
            .setAuthor({ name: `User Member Banned`, iconURL: member.user.displayAvatarURL() })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.toString() || "Unknown", inline: true},
                { name: "Member", value: member.user.toString(), inline: true },
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
            .setColor(`DarkRed` as ColorResolvable)
            .setAuthor({ name: `User Member Unbanned`, iconURL: member.user.displayAvatarURL() })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.toString() || "Unknown", inline: true},
                { name: "Member", value: member.user.toString(), inline: true },
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
            .setColor(`DarkGreen` as ColorResolvable)
            .setAuthor({ name: `Emoji Created`, iconURL: emoji.url, url: emoji.url })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.toString() || "Unknown", inline: true},
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
            .setColor(`DarkRed` as ColorResolvable)
            .setAuthor({ name: `Emoji Deleted`, iconURL: emoji.url, url: emoji.url })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.toString() || "Unknown", inline: true},
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
            .setColor(`DarkGold` as ColorResolvable)
            .setAuthor({ name: `Emoji Updated`, iconURL: newEmoji.url, url: newEmoji.url })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.toString() || "Unknown", inline: true},
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
            .setColor(`DarkGreen` as ColorResolvable)
            .setAuthor({ name: `Role Created`, iconURL: role.guild.iconURL(), url: role.guild.iconURL() })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.toString() || "Unknown", inline: true},
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
            .setColor(`DarkRed` as ColorResolvable)
            .setAuthor({ name: `Role Deleted`, iconURL: role.guild.iconURL(), url: role.guild.iconURL() })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.toString() || "Unknown", inline: true},
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

            if(oldRole.name !== newRole.name) {
            const embed = new Discord.EmbedBuilder()
            .setColor(`DarkGold` as ColorResolvable)
            .setAuthor({ name: `Role Name Updated`, iconURL: oldRole.guild.iconURL(), url: oldRole.guild.iconURL() })
            .addFields(
                { name: "Executor", value: fetchedLogs.entries.first()?.executor?.toString() || "Unknown", inline: true},
                { name: "Role", value: oldRole.toString(), inline: true },
                { name: "Old Name", value: oldRole.name, inline: true },
                { name: "New Name", value: newRole.name, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `ID: ${oldRole.id}` })
            await sendAudit(oldRole.guild, embed)
            }
            if(oldRole.icon !== newRole.icon) {
                const embed = new Discord.EmbedBuilder()
                .setColor(`DarkGold` as ColorResolvable)
                .setAuthor({ name: `Role Icon Updated`, iconURL: newRole.guild.iconURL(), url: newRole.guild.iconURL() })
                .addFields(
                    { name: "Executor", value: fetchedLogs.entries.first()?.executor?.toString() || "Unknown", inline: true},
                    { name: "Role", value: oldRole.toString(), inline: true },
                    { name: "Old Icon", value: oldRole.iconURL() ? `[\`Click here\`](${oldRole.iconURL()})` : 'None', inline: true },
                    { name: "New Icon", value: newRole.iconURL() ? `[\`Click here\`](${newRole.iconURL()})` : 'None', inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `ID: ${newRole.id}` })
                await sendAudit(oldRole.guild, embed)
            }
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
