import { Client } from "discord.js";
import mongoose from "mongoose";
import { color } from "../functions";

module.exports = (client: Client) => {
    const MONGO_URI = client.config.Database.Uri
    if (!MONGO_URI) return console.log(color("text",`🍃 Mongo URI not found, ${color("error", "skipping.")}`))
    mongoose.connect(`${MONGO_URI}/${client.config.Database.Collection}`)
    .then(() => console.log(color("text",`🍃 MongoDB connection has been ${color("variable", "established.")}`)))
    .catch(() => { 
        console.log(color("text",`🍃 MongoDB connection has been ${color("error", "failed.")}.. retrying in 8 seconds.`)) 
        const a = setInterval(() => {
            mongoose.connect(`${MONGO_URI}/${client.config.Database.Collection}`)
            .then(() => { console.log(color("text",`🍃 MongoDB connection has been ${color("variable", "established.")}.. cleared interval`)); clearInterval(a) })
            .catch(() => console.log(color("text",`🍃 MongoDB connection has been ${color("error", "failed.")}.. retrying in 8 seconds.`)))
        }, 8000)
    })
}