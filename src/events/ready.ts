import { Client } from "discord.js";
import { BotEvent } from "../types";
import { color } from "../functions";
import axios from "axios";

const event : BotEvent = {
    name: "ready",
    once: true,
    execute: async(client : Client) => {
        console.log(color("text", `💪 Logged in as ${color("variable", client.user?.tag)}`))
        client.user?.setPresence({ activities: [ { name: ".gg/azury", type: 2 } ], status: "online" })

        setInterval(() => { client.user?.setPresence({ activities: [ { name: client.config.Presence.Names[Math.random() * client.config.Presence.Names.length | 0], type: client.config.Presence.Type } ], status: client.config.Presence.Status }) }, 10000)

        const { exec } = require("child_process");

        setInterval(() => {
        exec("git log -1 --pretty=format:'%h - %s (%an, %ar)'", async (error: any, stdout: any, stderr: any) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            const channel = client.channels.cache.get('1053284414601297920') as any;
            const messages = await channel.messages.fetch({ limit: 100 });
            const firstArg = stdout.split(' ')[0];
                const filtered = messages.filter((m: any) => m.content.includes(`📝 Latest commit:\n${firstArg}`));
                if(filtered.size > 0) return;
            console.log(color("text", `📝 Latest commit: ${color("variable", stdout)}`));
            (client.channels.cache.get('1053284414601297920') as any)?.send({ content: `📝 Latest commit:\n${stdout}`})
        })
        }, 60000)
    }
}

export default event;