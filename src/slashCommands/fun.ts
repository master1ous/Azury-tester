import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder, CommandInteraction, SlashCommandSubcommandBuilder, ChatInputCommandInteraction, ButtonBuilder, ButtonInteraction, ColorResolvable, ButtonStyle } from "discord.js"
import Discord from "discord.js";
import { SlashCommand, SlashCommandList } from "../types";
import { PasteClient, Publicity, ExpireDate } from "pastebin-api";
import { pagesystem } from "../functions";
import ms = require("ms")
import nodefetch from "node-fetch";

const command: SlashCommand = {
    cooldown: 1,
    command: new SlashCommandBuilder()
    .setName("fun")
    .setDescription("Use the fun sub commands")
    .setDMPermission(false)
    .addSubcommandGroup(group =>
        group.setName('reddit')
        .setDescription('Use the reddit sub commands')
        .addSubcommand(subcommand =>
            subcommand.setName('meme')
            .setDescription('Get a random meme')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('cat')
            .setDescription('Get a random cat')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('duck')
            .setDescription('Get a random duck')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('dog')
            .setDescription('Get a random dog')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('bird')
            .setDescription('Get a random bird')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('fox')
            .setDescription('Get a random fox')
        )
        )
    .addSubcommandGroup(group =>
        group.setName('image')
        .setDescription('Use the image sub commands')
        .addSubcommand(subcommand =>
            subcommand.setName('meme')
            .setDescription('Get a random meme')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('cat')
            .setDescription('Get a random cat')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('duck')
            .setDescription('Get a random duck')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('dog')
            .setDescription('Get a random dog')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('bird')
            .setDescription('Get a random bird')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('fox')
            .setDescription('Get a random fox')
        )
    ),
    
            execute: async (interaction) => {
                const client = interaction.client
                
                  if((interaction as any).options.getSubcommandGroup() === 'reddit') {
                    if((interaction as any).options.getSubcommand() === 'meme') {
                        await interaction.deferReply({ ephemeral: false })
                        nodefetch('https://www.reddit.com/r/memes/random/.json').then(async(response: any) => {
                            const [list] = await response.json();
                            const [post] = list.data.children;
                            const permalink = post.data.permalink;
                            const memeUrl = `https://reddit.com${permalink}`;
                            const memeImage = post.data.url;
                            const memeTitle = post.data.title;
                            const memeUpvotes = post.data.ups;
                            const memeNumComments = post.data.num_comments;
                            const endsWith = memeImage.split('.').pop()

                            const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('👍')
                                .setCustomId('upvote')
                                .setLabel(`: ${memeUpvotes}`)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('💬')
                                .setCustomId('comment')
                                .setLabel(`: ${memeNumComments}`)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setEmoji('🔗')
                                .setLabel(': Memes by subreddit')
                                .setURL(memeUrl)
                            )

                            await interaction.editReply({ content: `[${memeTitle}](${memeImage})`, components: [row] })
                    })
                    }
                    if((interaction as any).options.getSubcommand() === 'cat') {
                        await interaction.deferReply({ ephemeral: false })
                        
                        nodefetch('https://www.reddit.com/r/cats/random/.json').then(async(response: any) => {
                            const [list] = await response.json();
                            const [post] = list.data.children;
                            const permalink = post.data.permalink;
                            const catUrl = `https://reddit.com${permalink}`;
                            const catImage = post.data.url;
                            const catTitle = post.data.title;
                            const catUpvotes = post.data.ups;
                            const catNumComments = post.data.num_comments;
                            const endsWith = catImage.split('.').pop()

                            const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('👍')
                                .setCustomId('upvote')
                                .setLabel(`: ${catUpvotes}`)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('💬')
                                .setCustomId('comment')
                                .setLabel(`: ${catNumComments}`)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setEmoji('🔗')
                                .setLabel(': Cats by subreddit')
                                .setURL(catUrl)
                            )

                            await interaction.editReply({ content: `[${catTitle}](${catImage})`, components: [row] })
                    })
                    }
                    if((interaction as any).options.getSubcommand() === 'duck') {
                        await interaction.deferReply({ ephemeral: false })
                        
                        nodefetch('https://www.reddit.com/r/duck/random/.json').then(async(response: any) => {
                            const [list] = await response.json();
                            const [post] = list.data.children;
                            const permalink = post.data.permalink;
                            const duckUrl = `https://reddit.com${permalink}`;
                            const duckImage = post.data.url;
                            const duckTitle = post.data.title;
                            const duckUpvotes = post.data.ups;
                            const duckNumComments = post.data.num_comments;
                            const endsWith = duckImage.split('.').pop()

                            const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('👍')
                                .setCustomId('upvote')
                                .setLabel(`: ${duckUpvotes}`)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('💬')
                                .setCustomId('comment')
                                .setLabel(`: ${duckNumComments}`)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setEmoji('🔗')
                                .setLabel(': Ducks by subreddit')
                                .setURL(duckUrl)
                            )

                            await interaction.editReply({ content: `[${duckTitle}](${duckImage})`, components: [row] })
                    })
                    }
                    if((interaction as any).options.getSubcommand() === 'dog') {
                        await interaction.deferReply({ ephemeral: false })
                        
                        nodefetch('https://www.reddit.com/r/dog/random/.json').then(async(response: any) => {
                            const [list] = await response.json();
                            const [post] = list.data.children;
                            const permalink = post.data.permalink;
                            const dogUrl = `https://reddit.com${permalink}`;
                            const dogImage = post.data.url;
                            const dogTitle = post.data.title;
                            const dogUpvotes = post.data.ups;
                            const dogNumComments = post.data.num_comments;
                            const endsWith = dogImage.split('.').pop()

                            const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('👍')
                                .setCustomId('upvote')
                                .setLabel(`: ${dogUpvotes}`)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('💬')
                                .setCustomId('comment')
                                .setLabel(`: ${dogNumComments}`)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setEmoji('🔗')
                                .setLabel(': Dogs by subreddit')
                                .setURL(dogUrl)
                            )

                            await interaction.editReply({ content: `[${dogTitle}](${dogImage})`, components: [row] })
                    })
                    }
                    if((interaction as any).options.getSubcommand() === 'bird') {
                        await interaction.deferReply({ ephemeral: false })
                        
                        nodefetch('https://www.reddit.com/r/birds/random/.json').then(async(response: any) => {
                            const [list] = await response.json();
                            const [post] = list.data.children;
                            const permalink = post.data.permalink;
                            const birdUrl = `https://reddit.com${permalink}`;
                            const birdImage = post.data.url;
                            const birdTitle = post.data.title;
                            const birdUpvotes = post.data.ups;
                            const birdNumComments = post.data.num_comments;
                            const endsWith = birdImage.split('.').pop()

                            const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('👍')
                                .setCustomId('upvote')
                                .setLabel(`: ${birdUpvotes}`)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('💬')
                                .setCustomId('comment')
                                .setLabel(`: ${birdNumComments}`)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setEmoji('🔗')
                                .setLabel(': Birds by subreddit')
                                .setURL(birdUrl)
                            )

                            await interaction.editReply({ content: `[${birdTitle}](${birdImage})`, components: [row] })
                    })
                    }
                    if((interaction as any).options.getSubcommand() === 'fox') {
                        await interaction.deferReply({ ephemeral: false })
                        
                        nodefetch('https://www.reddit.com/r/fox/random/.json').then(async(response: any) => {
                            const [list] = await response.json();
                            const [post] = list.data.children;
                            const permalink = post.data.permalink;
                            const foxUrl = `https://reddit.com${permalink}`;
                            const foxImage = post.data.url;
                            const foxTitle = post.data.title;
                            const foxUpvotes = post.data.ups;
                            const foxNumComments = post.data.num_comments;
                            const endsWith = foxImage.split('.').pop()

                            const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('👍')
                                .setCustomId('upvote')
                                .setLabel(`: ${foxUpvotes}`)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('💬')
                                .setCustomId('comment')
                                .setLabel(`: ${foxNumComments}`)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setEmoji('🔗')
                                .setLabel(': Foxes by subreddit')
                                .setURL(foxUrl)
                            )

                            await interaction.editReply({ content: `[${foxTitle}](${foxImage})`, components: [row] })
                    })
                    }
                }
                
                if((interaction as any).options.getSubcommandGroup() === 'image') {
                    if((interaction as any).options.getSubcommand() === 'meme') {
                        await interaction.deferReply({ ephemeral: false })

                       await interaction.editReply({ content: 'This command is currently disabled, as we can\'t find an API for it, please try out </fun reddit meme:1094066731607150623> for now.' })
                    }
                    if((interaction as any).options.getSubcommand() === 'cat') {
                        await interaction.deferReply({ ephemeral: false })
                       
                        // get a cat using nodefetch and not using reddit
                        nodefetch('https://api.thecatapi.com/v1/images/search').then(async(response: any) => {
                            const [list] = await response.json();
                            const catImage = list.url;
                            const endsWith = catImage.split('.').pop()
                            const att = new Discord.AttachmentBuilder(catImage, { name: `cat.${endsWith}` })

                            const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setEmoji('🔗')
                                .setLabel(': Cats by azury')
                                .setURL('https://discord.gg/azury')
                            )

                            await interaction.editReply({ files: [att], components: [row] })
                    })
                }
                if((interaction as any).options.getSubcommand() === 'dog') {
                    await interaction.deferReply({ ephemeral: false })
                   
                    // get a dog using nodefetch and not using reddit
                    nodefetch('https://api.thedogapi.com/v1/images/search').then(async(response: any) => {
                        const [list] = await response.json();
                        const dogImage = list.url;
                        const endsWith = dogImage.split('.').pop()
                        const att = new Discord.AttachmentBuilder(dogImage, { name: `dog.${endsWith}` })

                        const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setEmoji('🔗')
                            .setLabel(': Dogs by azury')
                            .setURL('https://discord.gg/azury')
                        )

                        await interaction.editReply({ files: [att], components: [row] })
                })
            }
            if((interaction as any).options.getSubcommand() === 'bird') {
                await interaction.deferReply({ ephemeral: false })
               
                // get a bird using nodefetch and not using reddit
                nodefetch('https://api.alexflipnote.dev/birb').then(async(response: any) => {
                    const list = await response.json();
                    const birdImage = list.file;
                    const endsWith = birdImage.split('.').pop()
                    const att = new Discord.AttachmentBuilder(birdImage, { name: `bird.${endsWith}` })

                    const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setEmoji('🔗')
                        .setLabel(': Birds by azury')
                        .setURL('https://discord.gg/azury')
                    )

                    await interaction.editReply({ files: [att], components: [row] })
            })
        }
        if((interaction as any).options.getSubcommand() === 'duck') {
            await interaction.deferReply({ ephemeral: false })
           
            // get a duck using nodefetch and not using reddit
            nodefetch('https://random-d.uk/api/v2/random').then(async(response: any) => {
                const list = await response.json();
                const duckImage = list.url;
                const endsWith = duckImage.split('.').pop()
                const att = new Discord.AttachmentBuilder(duckImage, { name: `duck.${endsWith}` })

                const row = new Discord.ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setEmoji('🔗')
                    .setLabel(': Ducks by azury')
                    .setURL('https://discord.gg/azury')
                )

                await interaction.editReply({ files: [att], components: [row] })
        })
    }
    if((interaction as any).options.getSubcommand() === 'fox') {
        await interaction.deferReply({ ephemeral: false })
       
        // get a fox using nodefetch and not using reddit
        nodefetch('https://randomfox.ca/floof/').then(async(response: any) => {
            const list = await response.json();
            const foxImage = list.image;
            const endsWith = foxImage.split('.').pop()
            const att = new Discord.AttachmentBuilder(foxImage, { name: `fox.${endsWith}` })

            const row = new Discord.ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setEmoji('🔗')
                .setLabel(': Foxes by azury')
                .setURL('https://discord.gg/azury')
            )

            await interaction.editReply({ files: [att], components: [row] })
    })
}
    }
    }
}

export default command