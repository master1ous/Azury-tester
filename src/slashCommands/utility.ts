import { SlashCommandBuilder, ChannelType, TextChannel, EmbedBuilder, CommandInteraction, ButtonStyle, SlashCommandSubcommandBuilder, ChatInputCommandInteraction, ButtonBuilder, AttachmentBuilder, ActionRowBuilder, Guild } from "discord.js"
import Discord from "discord.js";
import { SlashCommand } from "../types";
import { PasteClient, Publicity, ExpireDate } from "pastebin-api";
import AfkModel from "../schemas/Afk";
import RemindersModel from "../schemas/Reminder";
import ImagineModel from "../schemas/Imagine";
import ms = require("ms");
import dayjs = require("dayjs");
import axios from "axios";
import { isJsxFragment } from "typescript";

const command: SlashCommand = {
    cooldown: 10,
    command: new SlashCommandBuilder()
    .setName("utility")
    .setDescription("Use the utility sub commands")
    
    .addSubcommand((subcommand) =>
				subcommand.setName('afk')
					.setDescription('use the afk command')
                    .addStringOption(option =>
                        option.setName('reason')
                            .setRequired(false)
                            .setDescription('Reason for afk')
                    )
            )
    .addSubcommand((subcommand) =>
       subcommand.setName('tinyurl')
              .setDescription('use the tinyurl command')
                .addStringOption(option =>
                    option.setName('type')
                        .setRequired(true)
                        .setDescription('What type of url do you want to shorten')
                        .addChoices(
                            { name: 'cutt.ly/', value: '1' },
                            { name: 'cdpt.in/', value: '2' },
                            { name: 'is.gd/', value: '3' },
                            { name: 'tinyurl.com/', value: '4' },
                        )
                )
                        .addStringOption(option =>
                            option.setName('url')
                                .setRequired(true)
                                .setDescription('Url to shorten')
                        )
                )
    .addSubcommandGroup((group) =>
        group.setName('school')
        .setDescription('Use the school sub commands')
        .addSubcommand((subcommand) =>
            subcommand.setName('translate')
                .setDescription('use the translate command')
                .addStringOption(option =>
                    option.setName('text')
                        .setRequired(true)
                        .setDescription('Text to translate')
                )
                .addStringOption(option =>
                    option.setName('translate_to')
                        .setRequired(true)
                        .setDescription('What language to translate to')
                        .addChoices(
                            { name: 'English', value: 'english' },
                            { name: 'Dutch', value: 'dutch' },
                            { name: 'Spanish', value: 'spanish' },
                            { name: 'French', value: 'french' },
                            { name: 'Arabian', value: 'arabian' },
                            { name: 'Hindi', value: 'hindi' },
                            { name: 'Russian', value: 'russian' },
                            { name: 'Portuguese', value: 'portuguese' },
                            { name: 'German', value: 'german' },
                            { name: 'Japanese', value: 'japanese' },
                            { name: 'Turkish', value: 'turkish' },
                            { name: 'Mandarin', value: 'mandarin' },
                            { name: 'Latvian', value: 'latvian' },
                            { name: 'Swedish', value: 'swedish' },
                            { name: 'Lithuanian', value: 'lithuanian' },
                            { name: 'Ukrainian', value: 'ukrainian' },
                        )
                ),
        )
        .addSubcommand((subcommand) =>
        subcommand.setName('aichecker')
            .setDescription('use the aichecker command')
            .addStringOption(option =>
                option.setName('text')
                    .setRequired(true)
                    .setDescription('Text to check')
            )
        )
    )

    /*.addSubcommandGroup((group) => 
    group.setName('openai')
    .setDescription('use the openai sub commands')

    .addSubcommand((subcommand) =>
				subcommand.setName('gpt')
					.setDescription('use the openai gpt-3 command')
                    .addStringOption(option =>
                        option.setName('prompt')
                            .setRequired(true)
                            .setDescription('Enter your prompt for gpt-3')
                    )
            )
    .addSubcommand((subcommand) =>
            subcommand.setName('dalle')
                .setDescription('use the openai dalle command')
                .addStringOption(option =>
                    option.setName('prompt')
                        .setRequired(true)
                        .setDescription('Enter your prompt for dalle')
                )
          ),
    )*/
    .addSubcommand((subcommand) =>
        subcommand.setName('imagine')
            .setDescription('use the image command')
            .addStringOption(option =>
                option.setName('instruction')
                    .setRequired(true)
                    .setDescription('Instruction to draw')
            )
            .addStringOption(option =>
                option.setName('visibility')
                    .setRequired(true)
                    .setDescription('Do you want people to see this message?')
                    .addChoices(
                        { name: 'Yes', value: 'false' },
                        { name: 'No', value: 'true' },
                    )
            )
            .addIntegerOption(option =>
                option.setName('count')
                    .setRequired(false)
                    .setDescription('How many images to generate')
                    .addChoices(
                        { name: '1', value: 1 },
                        { name: '2', value: 2 },
                        { name: '3', value: 3 },
                        { name: '4', value: 4 },
                    )
            )
            .addStringOption(option =>
                option.setName('size')
                    .setRequired(false)
                    .setDescription('Size of the image')
                    .addChoices(
                        { name: '512x512', value: '512' },
                        { name: '768x768', value: '768' },
                    )
            )
            .addIntegerOption(option =>
                option.setName('guidance_scale')
                    .setRequired(false)
                    .setDescription('Guidance scale')
            )
            .addIntegerOption(option =>
                option.setName('infrence_steps')
                    .setRequired(false)
                    .setDescription('Infrence steps')
            )
    )
    .addSubcommand((subcommand) =>
                subcommand.setName('timestamp')
					.setDescription('Create a timestamp for dates')
                    .addStringOption(option =>
                        option.setName('time')
                            .setRequired(true)
                            .setDescription('Enter a time string, for example: now, now + 2 hours, next monday 12:00 UTC, 2021-01-01T12:00+02:00')
                    )
                    .addStringOption(option =>
                        option.setName('format')
                            .setRequired(true)
                            .setDescription('Choose how timestamp is displayed')
                            .addChoices(
                            { name: 'Short date/time (default)', value: 'f'},
                            { name: 'Long date/time', value: 'F'},
                            { name: 'Short time, HH:MM', value: 't'},
                            { name: 'Long time, HH:MM:SS', value: 'T'},
                            { name: 'Short date', value: 'd'},
                            { name: 'Long date', value: 'D'},
                            { name: 'Relative time', value: 'R'},
                            )
                    ),
            )
            .addSubcommandGroup((group) => 
            group.setName('reminder')
                .setDescription('Create a reminder')
                .addSubcommand((subcommand) =>
                    subcommand.setName('create')
                        .setDescription('Create a reminder')
                        .addStringOption(option =>
                            option.setName('time')
                                .setRequired(true)
                                .setDescription('Enter a time string, for example: 1h, 1m, 30s')
                        )
                        .addStringOption(option =>
                            option.setName('reminder')
                                .setRequired(true)
                                .setDescription('Enter your reminder')
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand.setName('clone')
                        .setDescription('Clone a reminder')
                        .addStringOption(option =>
                            option.setName('id')
                                .setRequired(true)
                                .setDescription('Enter the reminder id')
                        )
                        .addStringOption(option =>
                            option.setName('time')
                                .setRequired(false)
                                .setDescription('Enter a time string, for example: 1h, 1m, 30s')
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand.setName('delete')
                        .setDescription('Delete a reminder')
                        .addStringOption(option =>
                            option.setName('id')
                                .setRequired(true)
                                .setDescription('Enter the reminder id')
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand.setName('loop')
                        .setDescription('Create a reminder which loops')
                        .addStringOption(option =>
                            option.setName('time')
                                .setRequired(true)
                                .setDescription('Enter a time string, for example: 1h, 1m, 30s')
                        )
                        .addStringOption(option =>
                            option.setName('reminder')
                                .setRequired(true)
                                .setDescription('Enter your reminder')
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand.setName('list')
                        .setDescription('List all reminders')
                        
                )
        ),
            execute: async (interaction) => {
                const client = require('../index')
                if((interaction.options as any).getSubcommand() == 'tinyurl') {
                    await interaction.deferReply({ ephemeral: true })
                    const type = (interaction.options as any).getString('type') || '1';
                    const url = (interaction.options as any).getString('url')
                    
                    if(type == '1') {
                        const Shortener = require('link-shortener')  

                        const result = Shortener.Shorten(url)

                        result.then((res: any) => {
                            if(res === undefined) return interaction.editReply({ content: 'Invalid URL' })
                            interaction.editReply({ content: res })
                        })
                    } else if(type == '2') {
                        const shortUrl = require("node-url-shortener");

                        shortUrl.short(url, function(err: any, url: any){
                            if(err) return interaction.editReply({ content: 'Invalid URL' })
                            interaction.editReply({ content: url })
                        })
                    } else if(type == '3') {
                        const shorturl = require('shorturl');

                        shorturl(url, function(err: any, url: any){
                            if(err) return interaction.editReply({ content: 'Invalid URL' })
                            interaction.editReply({ content: url })
                        })
                    } else if(type == '4') {
                        const turl = require('turl');

                        turl.shorten(url, function(res: any){
                            interaction.editReply({ content: res })
                        }).catch((err: any) => {
                            interaction.editReply({ content: 'Invalid URL' })
                        })
                    }
                }
                if((interaction.options as any).getSubcommand() == 'imagine') {
                    const visibility = (interaction.options as any).getString('visibility') || 'false';
                    if(visibility == 'true') {
                    await interaction.deferReply({ ephemeral: true })
                    } else {
                    await interaction.deferReply({ ephemeral: false })
                    }
                    const instruction = (interaction.options as any).getString('instruction')
                    let count = (interaction.options as any).getInteger('count') || 1
                    const size = (interaction.options as any).getString('size') || '768x768';
                    let guidance_scale = (interaction.options as any).getInteger('guidance_scale') || 7.55;
                    let infrence_steps = (interaction.options as any).getInteger('infrence_steps') || 50;

                    const checkPremium = await interaction.client.checkPremium(interaction.user.id);
                    if(!checkPremium) return interaction.editReply({ content: `${await client.translate(`You need to be premium to use this command.`, interaction.guild?.id)}` })
                    if(checkPremium == 'cactus_not_in_gu_ld') return interaction.editReply({ content: `${await client.translate(`You need to be premium to use this command.`, interaction.guild?.id)}` })

                    const data = await ImagineModel.findOne({ userID: interaction.user.id })

                    const plural = count > 1 ? 'images' : 'image';
                    const text = instruction.length > 400 ? instruction.substring(0, 400) + '...' : instruction;

                    if(count > 4) {
                      await interaction.editReply({ content: `You can only generate a maximum of 4 images at a time` })
                      return;
                    }

                    if(guidance_scale > 20) {
                        guidance_scale = 20;
                    }
                    if(infrence_steps > 100) {
                        infrence_steps = 100;
                    }

                    if(data) {
                        if(data.usages >= 3) {
                            const time = ms((data.resetAt as any) - Date.now(), { long: true })
                            await interaction.editReply({ content: `You have reached your hourly limit of 3 images, check back ${time}` })
                            return;
                        }
    
                        data.usages = data.usages + 1;
    
                        await data.save()
                        } else {
                        const newData = new ImagineModel({
                            userID: interaction.user.id,
                            usages: 1,
                            resetAt: Date.now() + 3600000
                        }).save();
                    }


                    const moderation = await axios.post('https://api.openai.com/v1/moderations', {
                    "input": instruction,
                    }, {
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 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`
                    }
                    })
                    const data2 = moderation.data.results[0];
                    if(data2) {
                        if(data2.categories['sexual'] || data2.categories['sexual/minors'] || data2.categories['violence'] || data2.categories['violence/graphic'] || data2.categories['hate'] || data2.categories['hate/threatening'] || data2.categories['self-harm']){
                            await interaction.editReply({ content: `Your text contains content that is not allowed` })
                            return;
                        }
                    }

                    await interaction.editReply({ content: `Generating ${count} ${plural} with the instruction: ${text}` })

                    await axios.post('https://api.replicate.com/v1/predictions', {
                        "version": "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf", 
                        "input": {
                            "prompt": instruction,
                            "image_dimensions": size,
                            "num_outputs": count,
                            "guidance_scale": guidance_scale,
                            "num_inference_steps": infrence_steps,
                        }
                    }, {
                        headers: {
                            "Authorization": interaction.client.config.Authentication.Replicate,
                            "Content-Type": "application/json"
                        }
                    }).then(async(res) => {

                    await axios.get(`https://api.replicate.com/v1/predictions/${res.data.id}`, {
                        headers: {
                            "Authorization": interaction.client.config.Authentication.Replicate,
                            "Content-Type": "application/json"
                        }
                    }).then(async(response) => {

                    if(response.data.status == 'succeeded') {
                        let imgarray = [] as any;
                    response.data.output.forEach((element: any) => {
                        const attachment = new AttachmentBuilder(element, { name: 'imagine.png' });
                        imgarray.push(attachment)
                    })
                                await interaction.editReply({ files: imgarray })
                    } else {
                        let index = 0;
                        const a = setInterval(async() => {
                            const response = await axios.get(`https://api.replicate.com/v1/predictions/${res.data.id}`, {
                                headers: {
                                    "Authorization": interaction.client.config.Authentication.Replicate,
                                    "Content-Type": "application/json"
                                }
                            })
                                if(response.data.status == 'succeeded') {
                                    let imgarray = [] as any;
                    response.data.output.forEach((element: any) => {
                        const attachment = new AttachmentBuilder(element, { name: 'imagine.png' });
                        imgarray.push(attachment)
                    })
                    
                    console.log(response.data)

                    const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('🙁')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('🙁'),
                        new ButtonBuilder()
                            .setCustomId('😐')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('😐'),
                        new ButtonBuilder()
                            .setCustomId('🙂')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('🙂'),
                        new ButtonBuilder()
                            .setCustomId('😍')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('😍'),
                    )
                                const BtnMsg = await interaction.editReply({ content: `\\> ${text}`, files: imgarray, components: [row] })
                                const collector = BtnMsg.createMessageComponentCollector({ });

                                collector.on('collect', async(i: any) => {
                                    await i.deferReply({ ephemeral: true })
                                        await i.editReply({ content: `You have successfully rated [this creation](https://replicate.com/p/${res.data.id}) with ${i.customId}` })
                                })

                                clearInterval(a)
                                } else {
                                    index++;

                                    if(index > 50) {
                                        await interaction.editReply({ content: `Generating ${count} ${plural} with the instruction: ${text}\n• *Sorry for the long wait, the API is probably on hold*` })
                                    } else if(index > 20) {
                                        await interaction.editReply({ content: `Generating ${count} ${plural} with the instruction: ${text}\n• *Seems the API is taking a while to generate, please wait*` })
                                    }
                                }
                            }, 1000)
                    }
                })
                    })
                }
        if((interaction.options as any).getSubcommandGroup() == 'reminder') {
            if((interaction.options as any).getSubcommand() == 'loop') {
                await interaction.deferReply({ ephemeral: true })
                const time = (interaction.options as any).getString('time')
                const reminder = (interaction.options as any).getString('reminder')

                const checkPremium = await interaction.client.checkPremium(interaction.user.id);
                if(!checkPremium) return interaction.editReply({ content: `${await client.translate(`You need to be premium to use this command.`, interaction.guild?.id)}` })
                if(checkPremium == 'cactus_not_in_gu_ld') return interaction.editReply({ content: `${await client.translate(`You need to be premium to use this command.`, interaction.guild?.id)}` })

                const msTime = ms(time)

                const id = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)

                const reminderModel = new RemindersModel({
                    userID: interaction.user.id,
                    reminderID: id+` (looped)`,
                    time: Date.now() + msTime,
                    date: msTime,
                    reminder: reminder,
                    createdAt: new Date(Date.now()).toLocaleString(),
                    channel: interaction.channel.id,
                    loop: true,
                    parseDate: msTime,
                })

                await reminderModel.save()
                
                await interaction.editReply({ content: `${await client.translate(`Created a new reminder (${id}) which loops everytime it ends:`, interaction.guild?.id)}\n<:singlereply_white:1078059852296896562> ${reminder} • ends **${ms((msTime as any), { long: true })}**` })
            }
            if((interaction.options as any).getSubcommand() == 'create') {
                await interaction.deferReply({ ephemeral: true })
                const time = (interaction.options as any).getString('time')
                const reminder = (interaction.options as any).getString('reminder')

                const msTime = ms(time)

                const id = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)

                const reminderModel = new RemindersModel({
                    userID: interaction.user.id,
                    reminderID: id,
                    time: Date.now() + msTime,
                    date: msTime,
                    reminder: reminder,
                    createdAt: new Date(Date.now()).toLocaleString(),
                    channel: interaction.channel.id,
                    loop: false,
                })

                await reminderModel.save()
                
                await interaction.editReply({ content: `${await client.translate(`Created a new reminder (${id}):`, interaction.guild?.id)}\n<:singlereply_white:1078059852296896562> ${reminder} • ends **${ms((msTime as any), { long: true })}**` })
            } else if((interaction.options as any).getSubcommand() == 'list') {
                await interaction.deferReply({ ephemeral: true })
                const reminders = await RemindersModel.find({ userID: interaction.user.id })

                if(reminders.length == 0) return interaction.editReply(await client.translate('You dont have any reminders!', interaction.guild?.id))

                const embed = new Discord.EmbedBuilder()
                .setTitle(await client.translate('Your reminders', interaction.guild?.id))
                .setColor('#2F3136')
                .setFooter({ text: `${await client.translate(`Requested by`, interaction.guild?.id)} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })

                reminders.forEach(async(reminderz) => {
                    embed.addFields(
                        { name: `${reminderz.reminder.length > 27 ? reminderz.reminder.substring(0, 27) + "..." : reminderz.reminder} ***(\`${reminderz.reminderID}\`)***`, value: `<:singlereply_white:1078059852296896562> Reminder will end <t:${Math.floor((ms(reminderz.time)) / 1000)}:R>` }
                    )
                })

                await interaction.editReply({ embeds: [embed] })
            } else if((interaction.options as any).getSubcommand() == 'delete') {
                await interaction.deferReply({ ephemeral: true })
                const id = (interaction.options as any).getString('id')

                const reminderz = await RemindersModel.findOne({ userID: interaction.user.id, reminderID: id })

                if(!reminderz) return interaction.editReply(await client.translate('This reminder does not exist!', interaction.guild?.id))

                await interaction.editReply(await client.translate(`Successfully deleted the reminder for:`, interaction.guild?.id)+`\n<:singlereply_white:1078059852296896562> ${reminderz.reminder}`).then(async () => {
                    await RemindersModel.deleteOne({ userID: interaction.user.id, reminderID: id })
                })
            } else if((interaction.options as any).getSubcommand() == 'clone') {
                await interaction.deferReply({ ephemeral: true })
                const id = (interaction.options as any).getString('id')

                const reminderz = await RemindersModel.findOne({ userID: interaction.user.id, reminderID: id })

                if(!reminderz) return interaction.editReply(await client.translate('This reminder does not exist or has ended!', interaction.guild?.id))

                const time = (interaction.options as any).getString('time')

                const idz = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)

                if(time) {

                    const msTime = ms(time)

                const reminderModel = new RemindersModel({
                    userID: interaction.user.id,
                    reminderID: idz+` (cloned)`,
                    time: Date.now() + msTime,
                    date: msTime,
                    reminder: reminderz.reminder||`Invalid reminder set`,
                    createdAt: new Date(Date.now()).toLocaleString(),
                    channel: interaction.channel.id,
                    loop: false,
                })
                await reminderModel.save()

                await interaction.editReply({ content: `${await client.translate(`Cloned the reminder ${id} (${idz}):`, interaction.guild?.id)}\n<:singlereply_white:1078059852296896562> ${reminderz.reminder} • ends **${ms((msTime as any), { long: true })}**` })
            } else {
                const reminderModel = new RemindersModel({
                    userID: interaction.user.id,
                    reminderID: idz+` (cloned)`,
                    time: reminderz.time,
                    date: reminderz.date,
                    reminder: reminderz.reminder||`Invalid reminder set`,
                    createdAt: new Date(Date.now()).toLocaleString(),
                    channel: interaction.channel.id,
                    loop: false,
                })
                await reminderModel.save()

                await interaction.editReply({ content: `${await client.translate(`Cloned the reminder ${id} (${idz}):`, interaction.guild?.id)}\n<:singlereply_white:1078059852296896562> ${reminderz.reminder} • ends **${ms((reminderz.date as any), { long: true })}**` })
            }        
            }
        } 
        if((interaction.options as any).getSubcommandGroup() == 'school') {
            
        if ((interaction.options as any).getSubcommand() == 'translate') {
            await interaction.deferReply({ ephemeral: true })
            const text = (interaction.options as any).getString('text')
            const translate_to = (interaction.options as any).getString('translate_to')

            const client = require(`../index`)
            const translate = require('@iamtraction/google-translate')
            const translateText = await translate(text, { to: translate_to })

            const rows = new Discord.ActionRowBuilder<ButtonBuilder>()
            .addComponents([
                new Discord.ButtonBuilder()
                .setCustomId('translate')
                .setDisabled(true)
                .setLabel(`Translated to ${translate_to}`)
                .setStyle(Discord.ButtonStyle.Primary)
            ])

            await interaction.editReply({ content: `${await client.translate(`📚 Translated text:`, interaction.guild?.id)}\n<:singlereply_white:1078059852296896562> ${translateText.text}`, components: [rows] })
        } else if ((interaction.options as any).getSubcommand() == 'aichecker') { 
            await interaction.deferReply({ ephemeral: true })
            const text = (interaction.options as any).getString('text')

            let result;
            try {
                const response = await axios.post('https://api.gptzero.me/v2/predict/text', { document: text }, { headers: { 'Content-Type': 'application/json' } });
                const completely_generated_prob = response.data.documents[0].completely_generated_prob;
  
                if (completely_generated_prob <= 0.05) result = 'Text is likely to be written entirely by a human.';
                else if (completely_generated_prob <= 0.10) result = 'Text is likely to be written mostly by a human, with a small amount of AI-generated content.';
                else if (completely_generated_prob <= 0.25) result = 'Text is likely to be mostly written by a human, with a moderate amount of AI-generated content.';
                else if (completely_generated_prob <= 0.45) result = 'Text is likely to be a mixture of content generated by both an AI and a human, with no clear predominance of either type of content.';
                else if (completely_generated_prob <= 0.55) result = 'Text is likely to be equally written by an AI and a human.';
                else if (completely_generated_prob <= 0.75) result = 'Text is likely to be mostly written by an AI, with a moderate amount of human-generated content.';
                else if (completely_generated_prob <= 0.90) result = 'Text is likely to be written mostly by an AI, with a small amount of human-generated content.';
                else result = 'Text is likely to be written entirely by an AI.';
            } catch (error) {
                result = "An error occured, please try again later."
            }

            return interaction.editReply({ content: await client.translate(`🤔 ${result}`, interaction.guild?.id) })
        } 
    }
         if ((interaction.options as any).getSubcommand() == 'afk') {     
            await interaction.deferReply({ ephemeral: true })
            const reason = (interaction.options as any).getString('reason').replaceAll("@", "", true)

            const afk = await AfkModel.findOne({ userID: interaction.user.id })
            if(afk) {
                return interaction.editReply({
                    content: await client.translate(`You are already afk, chat to remove your afk status`, interaction.guild?.id),
                })
            }

            const newAfk = new AfkModel({
                guildID: interaction.guild.id,
                userID: interaction.user.id,
                reason: reason||await client.translate(`No reason provided`, interaction.guild?.id),
                created: dayjs(new Date()).unix()
            })

            await newAfk.save()

            interaction.editReply({
                content: `${await client.translate(`You are now afk, chat to remove your afk status`, interaction.guild?.id)}${reason ? '.' : `. ${await client.translate(`Did you know you can add a reason?`, interaction.guild?.id)}`}\n${await client.translate(`*You can include [afk], or (afk) in your message to stay afk while talking*`, interaction.guild?.id)}`,
            })
        } else if ((interaction.options as any).getSubcommand() == 'timestamp') {
            await interaction.deferReply({ ephemeral: true })
            const time = (interaction.options as any).getString('time')
            const format = (interaction.options as any).getString('format')

            const client = require(`../index`)

            let args = [];
            let eph = true;
            let arg1;
            let arg2;

            const regex = /^([a-zA-ZåäöÅÄÖ0-9-+_: ]{1,255})$/; // Regex types

            if (regex.test(time)) {
                if (format !== null) {
                    arg2 = "-f " + format;
                    args.push(arg2);
                }

                arg1 = "\"" + time + "\"";
                args.push(arg1);
                const replyMessage = await client.timestamp(args, eph, arg1);
                
                console.log(replyMessage)
        
          return interaction.editReply({
          content: replyMessage.toString(),
        })
        
            }
        } else if ((interaction.options as any).getSubcommand() == 'gpt') {
            await interaction.deferReply({ ephemeral: true })
            const prompt = (interaction.options as any).getString('prompt')

            const client = require(`../index`)

            const answers = await client.openai('gpt', prompt)

            if(answers == "OFFLINE_ERR") {
                return interaction.editReply({
                    content: await client.translate(`There was an issue while trying to generate the response, please try again later`, interaction.guild?.id),
                })
            }

            const answer = answers.replace(prompt, '')

            if(answer.length < 5000) {
            interaction.editReply({
                content: `\> ${prompt.length > 80 ? prompt.substring(0, 80) + "..." : prompt}\n\`\`\`${answer}\`\`\``,
            })
            } else {
                const url = await client.pastebin.createPaste({
                    code: answer,
                    expireDate: ExpireDate.Never,
                    format: "text",
                    name: "Response from GPT-3",
                    publicity: Publicity.Public,
                });

            interaction.editReply({
                content: `\> ${prompt.length > 80 ? prompt.substring(0, 80) + "..." : prompt}\n${await client.translate(`Too long to display, click here:`, interaction.guild?.id)}\n<:singlereply_white:1078059852296896562> ${url}`,
            })
            }
        } else if ((interaction.options as any).getSubcommand() == 'dalle') {
            await interaction.deferReply({ ephemeral: true })
            const prompt = (interaction.options as any).getString('prompt')

            const client = require(`../index`)

            const answers = await client.openai('dalle', prompt)

            if(answers == "OFFLINE_ERR") {
                return interaction.editReply({
                    content: await client.translate(`There was an issue while trying to generate the image, please try again later`, interaction.guild?.id),
                })
            }

            interaction.editReply({
                content: `\> ${prompt.length > 80 ? prompt.substring(0, 80) + "..." : prompt}||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||${answers}`,
            })
        }
    }
}

export default command