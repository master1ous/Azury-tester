import { SlashCommandBuilder, CommandInteraction, Collection, PermissionResolvable, Message, AutocompleteInteraction } from "discord.js"
import mongoose from "mongoose"

export interface SlashCommand {
    command: SlashCommandBuilder | any,
    execute: (interaction : CommandInteraction) => void,
    autocomplete?: (interaction: AutocompleteInteraction) => void,
    cooldown?: number, // in seconds
    id?: string
}

export interface SlashCommandList {
    command: SlashCommandBuilder | any,
    execute: (interaction : CommandInteraction) => void,
    autocomplete?: (interaction: AutocompleteInteraction) => void,
    cooldown?: number, // in seconds
    category?: string
}

export interface Command {
    name: string,
    execute: (message: Message, args: Array<string>) => void,
    permissions: Array<PermissionResolvable>,
    aliases: Array<string>,
    cooldown?: number,
}

interface GuildOptions {
    prefix: string,
}

export interface IGuild extends mongoose.Document {
    guildID: string,
    options: GuildOptions
    joinedAt: Date
}

export type GuildOption = keyof GuildOptions
export interface BotEvent {
    name: string,
    once?: boolean | false,
    execute: (...args?) => void
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string,
            CLIENT_ID: string,
            PREFIX: string,
            MONGO_URI: string,
            MONGO_DATABASE_NAME: string
        }
    }
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
        slashCommandsList: Collection<string, SlashCommand>
        commands: Collection<string, Command>,
        config: Collection<string>,
        translate: Collection<string>,
        snipe: Collection<string>,
        getInvites: Collection<string>,
        embedColor: Collection<string>,
        embedUrlColor: Collection<string>,
        awaitReply: Collection<string>,
        awaitRoleReply: Collection<string>,
        awaitChannelReply: Collection<string>,
        awaitEmojiReply: Collection<string>,
        checkURL: Collection<string>,
        checkPremium: Collection<string>,
        openai: Collection<string>,
        pastebin: Collection<string>,
        timestamp: Collection<string>,
        cooldowns: Collection<string, number>
    }
}