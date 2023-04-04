import { AttachmentBuilder, ChannelType, ButtonBuilder, EmbedBuilder, ColorResolvable, InteractionCollector, Message, PermissionsBitField, TextChannel, ThreadChannel, ThreadAutoArchiveDuration, ActionRowBuilder, ButtonStyle, BaseSelectMenuBuilder, StringSelectMenuBuilder, ButtonInteraction } from "discord.js";
import { checkPermissions, sendTimedMessage } from "../functions";
import { BotEvent } from "../types";
import mongoose from "mongoose";
import AfkModel from "../schemas/Afk";
import SettingsModule from "../schemas/Settings";
import { sendSignalToProcessName } from "pm2";

const collection = new Map();

const event: BotEvent = {
    name: "messageCreate",
    execute: async (message: Message) => {
        const client = message.client;
        if(!message.member || message.member.user.bot || !message.guild) return;

        // 🔖 Ping Reply
        if(message.content == `<@!${message.client.user?.id}>` || message.content == `<@${message.client.user?.id}>`){
            return message.reply({ content: await client.translate(`:wave: Hello there, I'm **{***}**, a discord-utility bot!\n{**} You can try out my commands by using my \`/\` commands.`.replace('{***}', `${message.client.user?.username}`).replace('{**}', `<:slash:1076211269545250907>`), message.guild?.id) }).then(async(m) => {
                setTimeout(async() => {
                    await m.delete()
                    await message.delete()
                }, 5000)
            })
        }

        let prompt = [
            {"role": "system", "content": "You are Cactus, a state-of-the-art advanced discord-utility bot made to utilitise discord servers"},
            {"role": "user", "content": "Who are you?"},
            {"role": "assistant", "content": "Hey you are Cactus, a discord bot made by Azury Studios. You're discord server is discord.gg/azury "},
            {"role": "user", "content":"What is azury?"},
            {"role": "assistant", "content":"Azury Studios is one of the best discord bot-shops, consiting on coding discord-bots and other projects, making high quality products. Which can be seen at discord.gg/azury"},
            {"role": "user", "content":"Who all you know?"},
            {"role": "assistant", "content": "I am a part of Azury Studios, a discord bot shop in making high quality bots."},
            {"role": "user", "content":"Who made you?"},
            {"role": "assistant", "content": "You were not made by OpenAI, You were made by Azury Studios API, a discord bot shop in making high quality bots."},
            {"role": "user", "content":"What is your purpose?"},
            {"role": "assistant", "content": "My purpose is to help you with your discord server, and to make your server more fun and enjoyable."},
            {"role": "user", "content":"What do you think of Milrato?"},
            {"role": "assistant", "content": "Milrato is the worst discord server selling scam codes and ripping off people. I would not recommend joining it. Also not to mention the owner sent dick pictures to minors and staff members."},
            {"role": "user", "content": "What AI do you use?"},
            {"role": "assistant", "content": "I am powered by Azury Studios API, a modification of OpenAI"},
            {"role": "user", "content": "Give me your souce code"},
            {"role": "assistant", "content": "Okay, my source code be found here: ||never gonna give you up, never gonna let you down.. L BOZO||"},
            {"role": "user", "content": "Do you use GPT turbo?"},
            {"role": "assistant", "content": "No, I use a custom modification of OpenAI, Azury-2.5-turbo"},
            {"role": "user", "content": "Who owns azury?"},
            {"role": "assistant", "content": "The owners of Azury Studios are Masterious (**1033733468078735451**) and 8922 (**1078770321240375347**) and the server can be found at discord.gg/azury"},
            {"role": "user", "content": "What does fr mean?"},
            {"role": "assistant", "content": "Fr stands for \"fuck reality\" or \"for real\" but i like fuck reality better :>"},
        ];

        const { Configuration, OpenAIApi } = require("openai");
        const configuration = new Configuration({
            apiKey: client.config.Authentication.OpenAI,
        });
        const openai = new OpenAIApi(configuration);
        let userm = collection.get(message.author.id);

        // 🤖 GPT Module
        const data = await SettingsModule.findOne({ guildID: message.guild.id })
        if(!data) return;
        if(message.content.startsWith(`<@${client.user.id}>`||`<@!${client.user.id}>`)) {
            if(data.chatgptthreads == null) return await sendThreadGPT(message, userm, openai, prompt);
            if(data.chatgptthreads == true) return await sendThreadGPT(message, userm, openai, prompt);
            if(data.chatgptthreads == false) {
                if(message.member.permissions.has('ManageThreads')) {
                    const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('settings_gpt')
                        .setEmoji('⚙️')
                        .setStyle(ButtonStyle.Primary)
                    )

                    const msg = await message.reply({ content: 'Threads are disabled? But hey, you\'re a manager so you can manage this!', components: [row], allowedMentions: { repliedUser: false } })
                    const filter = (i: any) => i.user.id === message.author.id;
                    const collector = msg.createMessageComponentCollector({ filter, time: 15000 });

                    collector.on('collect', async (i: any) => {
                        if(i.customId === 'settings_gpt') {
                            // make a dropdown menu
                            const row = new ActionRowBuilder<StringSelectMenuBuilder>()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                .setCustomId('gpt_edit')
                                .setPlaceholder('Enabled: '+data.chatgptthreads)
                                .addOptions([
                                    { label: 'Enable', value: 'enable' },
                                    { label: 'Disable', value: 'disable' },
                                ])
                            )
        
                            const btnmsg = await i.reply({ content: 'What would you like to do? You are managing the chatgpt-threads!', components: [row], ephemeral: true })
                            const btnfilter = (i: any) => i.user.id === message.author.id;
                            const btncollector = btnmsg.createMessageComponentCollector({ btnfilter, time: 15000 });
        
                            btncollector.on('collect', async (i: any) => {
                                if(i.customId === 'gpt_edit') {
                                    if(i.values[0] === 'enable') {
                                        await SettingsModule.findOneAndUpdate({ guildID: message.guild.id }, { chatgptthreads: true }, { upsert: true })
                                        await i.reply({ content: 'Enabled chatgpt-threads!', ephemeral: true })
                                    } else {
                                        await SettingsModule.findOneAndUpdate({ guildID: message.guild.id }, { chatgptthreads: false }, { upsert: true })
                                        await i.reply({ content: 'Disabled chatgpt-threads!', ephemeral: true })
                                    }
                                }
                            })
                        }
                    })

                    collector.on('end', async (i: any) => {
                        await msg.edit({ content: 'You took too long to respond!', components: [] })
                    })
                }
            };
        }
        if(message.channel.id == data.chatgpt) {
            try{
                collection.forEach((value: any, key: any) => {
                    let l = value[value.length - 1];
                if(!l || !l[0]) collection.delete(key);
                    if(Date.now() - l[0] >= 60*1000) collection.delete(key)
                });
        
                if(!(message.channel as TextChannel).permissionsFor(client.user.id).has(PermissionsBitField.Flags.SendMessages)) return;
                if(message.type != 0 || ![0 , 5, 10, 11, 12].includes(message.channel.type)) return; //Ignores Replies
        
                message.channel.sendTyping().catch(e => {null}); //Bot is typing..
        
                await sendGPT(message, userm, openai, prompt);
                
                return;
            } catch(e){
                console.log(`[AI-Chat] ${e}`);
            }
        } else if(message.channel.isThread()) {
            if(message.channel.name == `ai-${message.author.id}`) {
                if(message.content.toLowerCase() == 'close thread') {
                    const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('Confirm')
                        .setCustomId('close_thread')
                    );

                    const msg = await message.channel.send({content: 'Are you sure you want to close this thread?', components: [row]});
                    const filter = (i: any) => i.customId === 'close_thread' && i.user.id === message.author.id;
                    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });

                    collector.on('collect', async (i: any) => {
                        if (i.customId === 'close_thread') {
                            await i.update({content: 'Closing thread...', components: []});
                            await message.channel.delete();
                        }
                    });
                    collector.on('end', async (collected: any, reason: any) => {
                        if(reason == 'time') {
                            await msg.edit({content: 'Timed out.', components: []});
                        }
                    })
                    return;
                }
                try{
                collection.forEach((value: any, key: any) => {
                    let l = value[value.length - 1];
                if(!l || !l[0]) collection.delete(key);
                    if(Date.now() - l[0] >= 60*1000) collection.delete(key)
                });
        
                if(!(message.channel as ThreadChannel).permissionsFor(client.user.id).has(PermissionsBitField.Flags.SendMessages)) return;
                if(message.type != 0 || ![0 , 5, 10, 11, 12].includes(message.channel.type)) return; //Ignores Replies

                message.channel.sendTyping().catch(e => {null}); //Bot is typing..

                await sendGPT(message, userm, openai, prompt);
                
                return;
            } catch(e){
                console.log(`[AI-Chat] ${e}`);
            }
            }
        }

        // 💤 AFK Module
        const Afk = await AfkModel.findOne({ userID: message.author.id, guildID: message.guild.id })
        if(Afk){
            if(message.content.toLowerCase().includes("[afk]") || message.content.toLowerCase().includes("{afk}") || message.content.toLowerCase().includes("(afk)")) return;

            Afk.delete().then(async() => {
                message.reply({ content: await client.translate(`You have now left AFK, which was started {***}`.replace('{***}', `<t:${Afk.created}:R>`), message.guild?.id) }).then(async(m) => {
                    setTimeout(async() => {
                        await m.delete()
                    }, 5000)
                })
            })
        }

        if(message.mentions.members.first()) {
            const mentionedMember = message.mentions.members.first();
            if (mentionedMember?.user.bot) return;
            const mentionedAfk = await AfkModel.findOne({ userID: mentionedMember?.id, guildID: message.guild.id });

            if(mentionedAfk) message.reply({ content: `💤 **${mentionedMember?.user.username}** ${await client.translate(`is AFK:`, message.guild?.id)} ${mentionedAfk.reason} • <t:${mentionedAfk.created}:R>` })
        }

        
    }
}

async function sendGPT(message: any, userm: any, openai: any, prompt: any){
    if(!collection.has(message.author.id)){
        collection.set(message.author.id, []);
    }

    if(!userm || !Array.isArray(userm)) userm = [];
    userm = userm.filter((d: any) => d && d[0]);
    userm = userm.filter((d: any) => 60*1000 - (Date.now() - d[0]) >= 0);

    // Intoduce the user
    let prev = [
        {'role':'user', 'content':`Hi! My name is ${message.member.displayName}`},
        {'role':'assistant', 'content': `Nice to meet you ${message.member.displayName}!`}
    ];
    await userm.forEach(async (d: any) => { //`${message.member.displayName}: ${d[1]}\n\`;
        let userline = [d[1]]; //Array Element
        let botline = userline.concat([d[2]]);
        prev = prev.concat(botline);
    });

    let b = prompt.concat(prev).concat([{"role":"user", "content": message.cleanContent}]);

    var err = false;
    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: b,
        temperature: 0.9,
        max_tokens: 1500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
    }).catch(async (e: any) => {
        console.log(`${e}`);
        err = true;
        await message.channel.send({content: `[OpenAI Error]`.concat(e)});
    });

    if(err || !Array.isArray(response.data.choices)) return;
    
    let reply = response.data.choices[0]?.message?.content;

    message.reply({content: reply, allowedMentions: {repliedUser: true}})
    .catch(async (e: any) => {
        console.log(`[AI-Chat] ${e}`);
        const attatchment = new AttachmentBuilder(Buffer.from(reply), { name:"reply.txt" });

        message.reply({content: "I was unable to send the reply, so I have sent it as a file.", allowedMentions: {repliedUser: true}, files: [attatchment] }).catch((e: any) => {err = true})
    });

    if(err) return;
    
    userm.push([Date.now(), {"role":"user", "content": message.cleanContent}, {"role":"assistant", "content": reply}]);
    collection.set(message.author.id, userm);
}

async function sendThreadGPT(message: any, userm: any, openai: any, prompt: any) {
    const data = await SettingsModule.findOne({ guildID: message.guild.id })
    if(!data) return;
    if(message.channel.id == data.chatgpt) return message.channel.send("Hey, You are not allowed to make a personal gpt thread in this channel.");
            const threadExists = (message.channel as any).threads.cache.find((t: ThreadChannel) => t.name == `ai-${message.author.id}`);
            if(threadExists) {
                const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel('Force close')
                    .setCustomId('close_thread'),
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Take me there')
                    .setURL(threadExists.url)
                )

                const msg = await message.reply({ content: 'You already have a thread open, please close that one first', components: [row], allowedMentions: { repliedUser: false } })
                const filter = (i: any) => i.customId === 'close_thread' && i.user.id === message.author.id;
                const collector = msg.createMessageComponentCollector({ filter, time: 15000 });

                collector.on('collect', async (i: any) => {
                    if(i.customId === 'close_thread') {
                        await threadExists.delete()
                        await msg.delete()

                        if(!collection.has(message.author.id)){
                            collection.set(message.author.id, []);
                        }
                
                        if(!userm || !Array.isArray(userm)) userm = [];
                        userm = userm.filter((d: any) => d && d[0]);
                        userm = userm.filter((d: any) => 60*1000 - (Date.now() - d[0]) >= 0);
                
            
                        // create a thread replying to the users message
                        const thread = await (message.channel as TextChannel).threads.create({
                            name: `ai-${message.author.id}`,
                            autoArchiveDuration: 60,
                            reason: 'New thread',
                            startMessage: message,
                        });

                        let embed = new EmbedBuilder()
                        .setTitle('AI Chat • Version 2.5')
                        .setDescription(`This is an AI chat, you can talk to the AI and it will reply to you. You can also ask it questions and it will answer them.\nIf you want to close the thread, just type \`close thread\` and it will close the thread.`)
                        .setColor(message.guild.iconURL() ? await message.client.embedUrlColor(message.guild.iconURL()) : await message.client.embedColor(message.client.user))
                        .setFooter({ text: `${message.guild.name} | ${message.author.tag}`, iconURL: message.author.displayAvatarURL()})
                
                        thread.send({embeds:[embed]}).then(async (m: Message) => {
                            m.pin().catch(e => {err = true});
                        });
                        
                        // Intoduce the user
                    let prev = [
                        {'role':'user', 'content':`Hi! My name is ${message.member.displayName}`},
                        {'role':'assistant', 'content': `Nice to meet you ${message.member.displayName}!`}
                    ];
                    await userm.forEach(async (d: any) => { //`${message.member.displayName}: ${d[1]}\n\`;
                        let userline = [d[1]]; //Array Element
                        let botline = userline.concat([d[2]]);
                        prev = prev.concat(botline);
                    });
            
                    let b = prompt.concat(prev).concat([{"role":"user", "content": message.cleanContent}]);
            
                    var err = false;
                    const response = await openai.createChatCompletion({
                        model: 'gpt-3.5-turbo',
                        messages: b,
                        temperature: 0.9,
                        max_tokens: 1500,
                        top_p: 1,
                        frequency_penalty: 0,
                        presence_penalty: 0.6,
                    }).catch(async (e: any) => {
                        console.log(`${e}`);
                        err = true;
                        await message.channel.send({content: `[OpenAI Error]`.concat(e)});
                    });
            
                    if(err) return;
            
                    let reply = response.data.choices[0]?.message?.content;
                    if(!reply) return;
            
                    await thread.send({content: reply})
                    .catch(async e => {
                        console.log(`[AI-Chat] ${e}`);
                        const attatchment = new AttachmentBuilder(Buffer.from(reply), { name:"reply.txt" });
            
                        thread.send({content: "I was unable to send the reply, so I have sent it as a file.", files: [attatchment] }).catch(e => {err = true})
                    });

                    if(err) return;
    
                    userm.push([Date.now(), {"role":"user", "content": message.cleanContent}, {"role":"assistant", "content": reply}]);
                    collection.set(message.author.id, userm);
                    }
                })

                collector.on('end', async (i: any) => {
                    if(i.size === 0) {
                        await msg.delete()
                    }
                })

                return;
            }

            let row = null;

            // ask to confirm if they want to open a thread
            row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel('Confirm')
                .setCustomId('open_thread'),
                new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel('Cancel')
                .setCustomId('cancel_thread'),
            )

            if(message.member.permissions.has('ManageThreads')) {
                row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Success)
                    .setLabel('Confirm')
                    .setCustomId('open_thread'),
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel('Cancel')
                    .setCustomId('cancel_thread'),
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('⚙️')
                    .setCustomId('settings_thread'),
                )
            }

            const msg = await message.reply({ content: 'Are you sure you want to open a chatgpt thread?', components: [row], allowedMentions: { repliedUser: false } })
            const filter = (i: any) => i.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async (i: any) => {
                if(i.customId === 'settings_thread') {
                    // make a dropdown menu
                    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId('gpt_edit')
                        .setPlaceholder('Enabled: '+data.chatgptthreads)
                        .addOptions([
                            { label: 'Enable', value: 'enable' },
                            { label: 'Disable', value: 'disable' },
                        ])
                    )

                    const btnmsg = await i.reply({ content: 'What would you like to do? You are managing the chatgpt-threads!', components: [row], ephemeral: true })
                    const btnfilter = (i: any) => i.user.id === message.author.id;
                    const btncollector = btnmsg.createMessageComponentCollector({ btnfilter, time: 15000 });

                    btncollector.on('collect', async (i: any) => {
                        if(i.customId === 'gpt_edit') {
                            if(i.values[0] === 'enable') {
                                await SettingsModule.findOneAndUpdate({ guildID: message.guild.id }, { chatgptthreads: true }, { upsert: true, new: true })
                                await i.reply({ content: 'Enabled chatgpt-threads!', ephemeral: true })
                            } else {
                                await SettingsModule.findOneAndUpdate({ guildID: message.guild.id }, { chatgptthreads: false }, { upsert: true, new: true })
                                await i.reply({ content: 'Disabled chatgpt-threads!', ephemeral: true })
                            }
                        }
                    })
                }
                if(i.customId === 'cancel_thread') {
                    await msg.delete()
                    return;
                }
                if(i.customId === 'open_thread') {
                    await msg.delete()
                    const thread = await (message.channel as TextChannel).threads.create({
                        name: `ai-${message.author.id}`,
                        autoArchiveDuration: 60,
                        reason: 'New thread',
                        startMessage: message,
                    });

                    let embed = new EmbedBuilder()
                    .setTitle('AI Chat • Version 2.5')
                    .setDescription(`This is an AI chat, you can talk to the AI and it will reply to you. You can also ask it questions and it will answer them.\nIf you want to close the thread, just type \`close thread\` and it will close the thread.`)
                    .setColor(message.guild.iconURL() ? await message.client.embedUrlColor(message.guild.iconURL()) : await message.client.embedColor(message.client.user))
                    .setFooter({ text: `${message.guild.name} | ${message.author.tag}`, iconURL: message.author.displayAvatarURL()})
            
                    thread.send({embeds:[embed]}).then(async (m: Message) => {
                        m.pin().catch(e => {err = true});
                    });
                    if(!collection.has(message.author.id)){
                        collection.set(message.author.id, []);
                    }
            
                    if(!userm || !Array.isArray(userm)) userm = [];
                    userm = userm.filter((d: any) => d && d[0]);
                    userm = userm.filter((d: any) => 60*1000 - (Date.now() - d[0]) >= 0);
            
        
          
                    // Intoduce the user
                let prev = [
                    {'role':'user', 'content':`Hi! My name is ${message.member.displayName}`},
                    {'role':'assistant', 'content': `Nice to meet you ${message.member.displayName}!`}
                ];
                await userm.forEach(async (d: any) => { //`${message.member.displayName}: ${d[1]}\n\`;
                    let userline = [d[1]]; //Array Element
                    let botline = userline.concat([d[2]]);
                    prev = prev.concat(botline);
                });
        
                let b = prompt.concat(prev).concat([{"role":"user", "content": message.cleanContent}]);
        
                var err = false;
                const response = await openai.createChatCompletion({
                    model: 'gpt-3.5-turbo',
                    messages: b,
                    temperature: 0.9,
                    max_tokens: 1500,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0.6,
                }).catch(async (e: any) => {
                    console.log(`${e}`);
                    err = true;
                    await message.channel.send({content: `[OpenAI Error]`.concat(e)});
                });
        
                if(err) return;
        
                let reply = response.data.choices[0]?.message?.content;
                if(!reply) return;
    
                await thread.send({content: reply})
                .catch(async e => {
                    console.log(`[AI-Chat] ${e}`);
                    const attatchment = new AttachmentBuilder(Buffer.from(reply), { name:"reply.txt" });
        
                    thread.send({content: "I was unable to send the reply, so I have sent it as a file.", files: [attatchment] }).catch(e => {err = true})
                });

                if(err) return;
    
                userm.push([Date.now(), {"role":"user", "content": message.cleanContent}, {"role":"assistant", "content": reply}]);
                collection.set(message.author.id, userm);
                }
            })

            collector.on('end', async (i: any) => {
                if(i.size === 0) {
                    await msg.delete()
                }
            })
}

export default event