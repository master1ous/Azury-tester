import { Client, Message, GuildMember, ChannelType, PermissionsBitField, Collection } from "discord.js";
import { BotEvent } from "../types";
import { color } from "../functions";

import model from "../schemas/Settings";

const event : BotEvent = {
    name: "guildMemberAdd",
    once: false,
    execute: async(member: GuildMember) => {
        const data = await model.findOne({ guildID: member.guild?.id })
        if(!data) return;

        if(data.welcome[0]){
            if(data.welcome[0].enabled == false) return;
                const channel = member.guild?.channels.cache.get(data.welcome[0].channel)
                if(!channel) return;

                const messages = data.welcome[0].message.replaceAll('{user.mention}', member.user).replaceAll('{user.tag}', member.user.tag).replaceAll('{user.id}', member.user.id).replaceAll('{user.username}', member.user.username).replaceAll('{user.discriminator}', member.user.discriminator).replaceAll('{guild.name}', member.guild?.name).replaceAll('{guild.id}', member.guild?.id).replaceAll('{guild.memberCount}', member.guild?.memberCount.toString());

                (channel as any).send({ content: messages||`:wave: Welcome to the server ${member.user}, we now have ${member.guild?.memberCount}` })
        }

    }
}

export default event;