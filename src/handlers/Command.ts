import { Client, Routes, SlashCommandBuilder } from "discord.js";
import { REST } from "@discordjs/rest"
import { readdirSync } from "fs";
import { join } from "path";
import { color } from "../functions";
import { Command, SlashCommand } from "../types";

module.exports = (client : Client) => {
    const slashCommands : SlashCommandBuilder[] = []

    let slashCommandsDir = join(__dirname,"../slashCommands")

    readdirSync(slashCommandsDir).forEach(file => {
        if (!file.endsWith(".ts")) return;
        let command : SlashCommand = require(`${slashCommandsDir}/${file}`).default
        slashCommands.push(command.command)
        client.slashCommands.set(command.command.name, command)
    })

    const rest = new REST({version: "10"}).setToken(client.config.Authentication.Token);


    rest.put(Routes.applicationCommands(client.config.Authentication.Client_ID), {
        body: slashCommands.map(command => command.toJSON())
    })
    .then((data : any) => {
        data.forEach((command : any) => {
            client.slashCommandsList.set(command.name, command)
        })
        console.log(color("text", `🔥 Successfully loaded ${color("variable", data.length)} slash command(s)`))
    }).catch(e => {
        console.log(e)
    })
}

