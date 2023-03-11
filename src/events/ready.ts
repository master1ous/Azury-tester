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
    
        // show all files changed and send it in a message
        // command to push code to github
        // git add . && git commit -m "message" && git push
    }
}

export default event;