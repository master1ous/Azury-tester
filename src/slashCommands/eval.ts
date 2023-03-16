import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder, CommandInteraction, SlashCommandSubcommandBuilder, ChatInputCommandInteraction, ButtonBuilder, ButtonInteraction, ColorResolvable } from "discord.js"
import Discord from "discord.js";
import { SlashCommand, SlashCommandList } from "../types";
import { PasteClient, Publicity, ExpireDate } from "pastebin-api";
import { pagesystem } from "../functions";
import ms = require("ms")
import { arrayBuffer } from "stream/consumers";

const command: SlashCommand = {
    cooldown: 1,
    command: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Use the info sub commands")
    .addStringOption(option =>
        option.setName('string')
        .setRequired(true)
        .setDescription('Enter a string to eval')
        ),
    
            execute: async (interaction) => {
                await interaction.deferReply({ ephemeral: true })
                const client = interaction.client
                const { guild, member, channel, options } = interaction
                const { user } = member
                const { id, username, discriminator, avatar } = user

                const ids = ["693553429380857978", "1071173004891009024", "705048027865415690"] 

                const evalString = (options as any).getString('string');

                if(!(ids as any).includes(interaction.user?.id)) return interaction.editReply({ content: 'You do not have permission to use this command!' });

                const embed = new EmbedBuilder()
                .setTitle('Eval started...')
                .setDescription(`Started:\n\`\`\`ts\n${evalString}\`\`\``)
                .setColor('Yellow' as ColorResolvable)

                try {
                    const evaled = await eval(evalString);

                    embed.setTitle('Eval finished!')
                    embed.setDescription(`Finished:\n\`\`\`ts\n${evaled}\`\`\``)
                    embed.setColor('Green' as ColorResolvable)

                    await interaction.editReply({ embeds: [embed] })
                    
                } catch (error) {
                    embed.setTitle('Eval failed!')
                    embed.setDescription(`Failed:\n\`\`\`ts\n${error}\`\`\``)
                    embed.setColor('Red' as ColorResolvable)

                    await interaction.editReply({ embeds: [embed] })
                }
                  
    }
}

export default command