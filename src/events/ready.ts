import { Client } from "discord.js";
import { BotEvent } from "../types";
import { color } from "../functions";

const event : BotEvent = {
    name: "ready",
    once: true,
    execute: (client : Client) => {
        console.log(color("text", `💪 Logged in as ${color("variable", client.user?.tag)}`))
        client.user?.setPresence({ activities: [ { name: ".gg/azury", type: 2 } ], status: "online" })

        setInterval(() => { client.user?.setPresence({ activities: [ { name: client.config.Presence.Names[Math.random() * client.config.Presence.Names.length | 0], type: client.config.Presence.Type } ], status: client.config.Presence.Status }) }, 10000)

        // list all updated files in a message using child_process
        const { exec } = require("child_process");
        exec("git diff --name-only", (error: any, stdout: any, stderr: any) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }

            const files = stdout.split("\n");
            if (files.length > 0) {
                (client.channels.cache.get("1053284414601297920") as any)?.send({ content: `**${files.length}** files have been updated:\n\`\`\`${files.join("\n")}\`\`\`` })
            }
        });
    }
}

export default event;