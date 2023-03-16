import { Client, GatewayIntentBits, Partials, ActivityType, PresenceUpdateStatus, Collection, Options, SlashCommandAssertions, PermissionsBitField, PermissionFlagsBits, ChannelType, SlashCommandBuilder, ShardClientUtil, ContextMenuCommandBuilder } from "discord.js";
import { SlashCommand, SlashCommandList } from "../types";
import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import { readdirSync } from "fs";
import { join } from "path";
export class BotClient extends Client {
    constructor() {
        super({
            /*shardCount: getInfo().TOTAL_SHARDS,
            shards: getInfo().SHARD_LIST,*/ // Not needed yet
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildInvites,
            ],
            partials: [
                Partials.GuildMember,
                Partials.Message,
                Partials.Reaction,
                Partials.User,
            ],
            presence: {
                activities: [
                    {
                        name: "Booting up...",
                        type: ActivityType.Playing,
                    },
                ],
                status: PresenceUpdateStatus.Online,
            },
            sweepers: {
                messages: {
                    lifetime: 300, // 5 minutes
                    interval: 60, // 1 minute
                },
            }
        })

        this.init()

        this.snipe = new Collection<any, any>()
        this.slashCommands = new Collection<string, SlashCommand>()
        this.slashCommandsList = new Collection<string, SlashCommandList>()
        this.cooldowns = new Collection<string, number>()
        this.config = require('../config.json')

        this.loadHandler()
        this.loadAntiCrash()
        this.login(require('../config.json').Authentication.Token)
    }
    async init() {
        return this.emit('ready', this)
    }
    async loadHandler() {
        const handlersDir = join(__dirname, "../handlers")
        readdirSync(handlersDir).forEach(handler => {
            require(`${handlersDir}/${handler}`)(this)
        })
    }
    async loadAntiCrash() {
        process.on('unhandledRejection', (reason, p) => {
            console.log(' [antiCrash] :: Unhandled Rejection/Catch');
            console.log(reason, p);
        });
        process.on("uncaughtException", (err, origin) => {
            console.log(' [antiCrash] :: Uncaught Exception/Catch');
            console.log(err, origin);
        })
        process.on('uncaughtExceptionMonitor', (err, origin) => {
            console.log(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
            console.log(err, origin);
        });
        process.on('multipleResolves', () => {
            //console.log(' [antiCrash] :: Multiple Resolves');
            //console.log(type, promise, reason);
        });
    }
}