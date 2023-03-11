import chalk from "chalk"
import { Guild, GuildMember, PermissionFlagsBits, PermissionResolvable, PermissionsBitField, TextChannel,ButtonBuilder, ButtonInteraction } from "discord.js"
import Discord from "discord.js";
import { GuildOption } from "./types"
import mongoose from "mongoose";

type colorType = "text" | "variable" | "error"

const themeColors = {
    text: "#ff8e4d",
    variable: "#ff624d",
    error: "#f5426c"
}

export const getThemeColor = (color: colorType) => Number(`0x${themeColors[color].substring(1)}`)

export const color = (color: colorType, message: any) => {
    return chalk.hex(themeColors[color])(message)
}

// interaction, buttonMessage, pages, buttons
export const pagesystem = async (interaction: any, buttonMessage: any, pages: any, buttons: any) => {
    const filter = (button: ButtonInteraction) => button.user.id === interaction.user.id;
            const collector = (buttonMessage as any).createMessageComponentCollector(filter, { time: 60000 })

            let page = 0;
            let maxPage = pages.length - 1;
            let currentPage = pages[page]

            collector.on('collect', async (button: ButtonInteraction) => {
                if (button.customId == 'next') {
                    if (page == maxPage) return button.update({ embeds: [currentPage], components: [new Discord.ActionRowBuilder<ButtonBuilder>().addComponents(buttons)] });
                    page++;
                    currentPage = pages[page]
                    await button.update({ embeds: [currentPage], components: [new Discord.ActionRowBuilder<ButtonBuilder>().addComponents(buttons)] })
                }
                if (button.customId == 'previous') {
                    if (page == 0) return button.update({ embeds: [currentPage], components: [new Discord.ActionRowBuilder<ButtonBuilder>().addComponents(buttons)] });
                    page--;
                    currentPage = pages[page]
                    await button.update({ embeds: [currentPage], components: [new Discord.ActionRowBuilder<ButtonBuilder>().addComponents(buttons)] })
                }
                
            }
            )

            collector.on('end', async () => {
                await buttonMessage.edit({ content: `Interaction has ended! Use the command again to continue using.`, embeds: [currentPage], components: [] })
            }
            )
}

export const checkPermissions = (member: GuildMember, permissions: Array<PermissionResolvable>) => {
    let neededPermissions: PermissionResolvable[] = []
    permissions.forEach(permission => {
        if (!member.permissions.has(permission)) neededPermissions.push(permission)
    })
    if (neededPermissions.length === 0) return null
    return neededPermissions.map(p => {
        if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ")
        else return Object.keys(PermissionFlagsBits).find(k => Object(PermissionFlagsBits)[k] === p)?.split(/(?=[A-Z])/).join(" ")
    })
}

export const sendTimedMessage = (message: string, channel: TextChannel, duration: number) => {
    channel.send(message)
        .then(m => setTimeout(async () => (await channel.messages.fetch(m)).delete(), duration))
    return
}