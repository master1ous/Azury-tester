import { ChannelType, ColorResolvable, InteractionCollector, Message, TextChannel } from "discord.js";
import { checkPermissions, sendTimedMessage } from "../functions";
import { BotEvent } from "../types";
import Discord from "discord.js";
import mongoose from "mongoose";
import AfkModel from "../schemas/Afk";
import { PasteClient, Publicity, ExpireDate } from "pastebin-api";
import Canvas from "canvas";
import { TextChange } from "typescript";
import pm2 from "pm2";
import ms from "ms";
import axios from "axios";

const event: BotEvent = {
    name: "messageCreate",
    execute: async (message: Message) => {
        const client = message.client;
        if(!message.member || message.member.user.bot || !message.guild) return;

        if(message.channel.id == '1082804077345378375') {
            (message.channel as TextChannel).sendTyping();
            const msg = message.content;
            try {
            const request = await axios.post('https://api.openai.com/v1/moderations', {
                "input": msg,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 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`
                }
            })
            const data2 = request.data.results[0];
            

            if(data2) {
                if(data2.categories['sexual'] || data2.categories['sexual/minors'] || data2.categories['violence'] || data2.categories['violence/graphic'] || data2.categories['hate'] || data2.categories['hate/threatening'] || data2.categories['self-harm']){
                    message.reply({ content: "Your message was flagged against our policy, please refrain from sending those content." })
                    return;
                }
            }

            if(msg.includes('slur')) {
                message.reply({ content: "Your message was flagged against our policy, please refrain from sending those content." })
                return;
            }

            const res = await axios.post('https://chatgpt-api.shn.hk/v1/', {
                "model": "gpt-3.5-turbo",
                "messages": [{ "role": "user", "content": msg }],
        }, {
            headers: {
                'Content-Type': 'application/json',
            }
            })

            const data = res.data;

            console.log(data);

            const text = data.choices[0].message.content.length > 2000 ? `too long to buffer... (read file)` : data.choices[0].message.content;
            const file = data.choices[0].message.content.length > 2000 ? new Discord.AttachmentBuilder(Buffer.from(data.choices[0].message.content), { name: 'response.txt' }) : null;
            
            if(!file) {
            message.reply({ content: text
                .replaceAll('@everyone', '').replaceAll('@ everyone', '').replaceAll('@@everyone', '')
                .replaceAll('@here', '').replaceAll('@ here', '').replaceAll('@@here', '') })
            } else {
                message.reply({ content: text.replaceAll('@everyone', '').replaceAll('@ everyone', '').replaceAll('@@everyone', '')
                .replaceAll('@here', '').replaceAll('@ here', '').replaceAll('@@here', ''), files: [file] })
            }
        } catch(e) {
            console.log(e)
            message.reply({ content: "Seems like OpenAI is currently on ratelimit!" })
        }
    }

        // Staff stuff
        if(message.member.roles.cache.has("1053299955713974302")) {
            if(message.content.startsWith("!findmember")) {
                const args = message.content.split(" ");

                if(!args[1]) return message.reply({ content: "Please specify a user!" })
                const closest = closestMatch(args[1], client.users.cache.map((user: any) => user.username));

                console.log(closest)

                const user = client.users.cache.find(user => user.username == closest);

                if(!user) return message.reply({ content: "User not found!" })

                message.reply({ content: `Found user: ${user.tag} (${user.id})` })
            }
            if(message.content.startsWith("!receipt")) {
                const args = message.content.split(" ");
                const user = message.mentions.members.first();
                if(!user) return message.reply({ content: "Please mention a user!" })
                if(!args.slice(2).join(" ")) return message.reply({ content: "Please specify an item!" })

                const msg = await message.reply({ content: `${user} creating your receipt..` });


                const canvas = Canvas.createCanvas(500, 550);
                const ctx = canvas.getContext('2d');

                const receipt_code = Math.random().toString(36).substring(2, 15)

                
                const color = "#000000"

                ctx.fillStyle = `${color}80`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.fillStyle = "#ffffff80";
                ctx.font = "bold 30px Arial";
                ctx.fillText("Customer:", 30, 50);

                ctx.fillStyle = "#ffffff80";
                ctx.font = "bold 30px Arial";
                ctx.fillText("Receipt:", 30, 150);

                ctx.fillStyle = "#ffffff80";
                ctx.font = "bold 30px Arial";
                ctx.fillText("Item:", 30, 250);

                ctx.fillStyle = "#ffffff80";
                ctx.font = "bold 30px Arial";
                ctx.fillText("Date:", 30, 340);

                // ~~~~~~~~~~~~~~ITEMS
                ctx.fillStyle = "#ffffff80";
                ctx.font = "bold 30px Arial";
                ctx.fillText(user.user.tag, 40, 90);

                ctx.fillStyle = "#ffffff80";
                ctx.font = "bold 30px Arial";
                ctx.fillText(receipt_code, 40, 190);

                ctx.fillStyle = "#ffffff80";
                ctx.font = "bold 30px Arial";
                ctx.fillText(args.slice(2).join(" ").toLowerCase(), 40, 290);

                ctx.fillStyle = "#ffffff80";
                ctx.font = "bold 30px Arial";
                ctx.fillText(new Date().toLocaleString(), 40, 390);

                ctx.fillStyle = "#ffffff80";
                ctx.font = "bold 30px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("Azury Studios • Receipt", 250, 500);

                
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, 750);
                ctx.lineTo(500, 750);
                ctx.lineTo(500, 0);
                ctx.lineTo(0, 0);
                ctx.strokeStyle = `${color}70`;
                ctx.lineJoin = "round";
                ctx.lineWidth = 40;
                ctx.stroke();


                const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), { name: "receipt.png" });
                msg.edit({ content: `${user} your receipt has been made!\n• *Dont loose this recepit otherwise we have no proof of purchase*`, files: [attachment] });

                (message.client.channels.cache.get("1075911527376363520") as any).send({ content: `**${message.author.tag}** made a receipt for ${user}\n• Item: ${args.slice(2).join(" ").toLowerCase()}`, files: [attachment] })
            }
            if(message.content.startsWith("!totalreceipts")) {
                const user = message.mentions.members.first();
                if(!user) return message.reply({ content: "Please mention a user!" })

                const channel = message.client.channels.cache.get("1075911527376363520") as any;
                const messages = await channel.messages.fetch({ limit: 100 });
                const filtered = messages.filter((m: any) => m.content.includes(user.user.id) && m.content.includes("made a receipt for"));
                message.reply({ content: `**${user.user.username}** has ${filtered.size} receipts (not accurate due to discord msg fetch limit)` })
            }
            if(message.content.startsWith("!roleinfo")) {
                const role = message.mentions.roles.first() || message.guild.roles.cache.get(message.content.split(" ")[1]);
                if(!role) return message.reply({ content: "Please mention a role!" })

                const canvas = Canvas.createCanvas(700, 100);
                const ctx = canvas.getContext('2d');

                ctx.fillStyle = `${role.hexColor}80`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, 100);
                ctx.lineTo(700, 100);
                ctx.lineTo(700, 0);
                ctx.lineTo(0, 0);
                ctx.strokeStyle = `rgba(0, 0, 0, 0)`;
                ctx.lineJoin = "round";
                ctx.lineWidth = 40;
                ctx.stroke();
            
                ctx.font = "40px sans-serif";
                ctx.fillStyle = "#ffffff";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(`${role.name}`, 350, 50);



                const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), { name: "roleinfo.png" });
                message.reply({ content: `Here is the info for the role **${role.name}**`, files: [attachment] })
            }
            if(message.content.startsWith("!canvas_color")) {
                let color = message.content.split(" ")[1];
                if(!color) return message.reply({ content: "Please specify a color!" })
                const text = message.content.split(" ").slice(2).join(" ");
                if(!text) return message.reply({ content: "Please specify a text!" })

                // if color doesnt start with # then add it
                if(!color.startsWith("#")) color = `#${color}`;

                const canvas = Canvas.createCanvas(700, 100);
                const ctx = canvas.getContext('2d');

                ctx.fillStyle = `${color}80`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, 100);
                ctx.lineTo(700, 100);
                ctx.lineTo(700, 0);
                ctx.lineTo(0, 0);
                ctx.strokeStyle = `rgba(0, 0, 0, 0)`;
                ctx.lineJoin = "round";
                ctx.lineWidth = 40;
                ctx.stroke();
            
                ctx.font = "40px sans-serif";
                ctx.fillStyle = "#ffffff";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(`${text}`, 350, 50);


                const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), { name: "colorcanva.png" });
                message.reply({ content: `Here is the canva for BASIC_COLOR`, files: [attachment] })
            }
            if(message.content.startsWith("!color_from_image")) {
                const image = message.mentions.users.first()?.displayAvatarURL() || message.attachments.first()?.url || message.content.split(" ")[1];
                if(!image) return message.reply({ content: "Please specify an image!" })

                const color = async function (url: string) {
                    try {
                    const { createCanvas, loadImage } = require('canvas')
                    const canvas = createCanvas(100, 100)
                    const ctx = canvas.getContext('2d')
                    const image = await loadImage(url.replace(".webp", ".png").replace(".gif", ".png").replace(".jpg", ".png").replace(".jpeg", ".png"))
                    ctx.drawImage(image, 0, 0, 100, 100)
                    const data = ctx.getImageData(0, 0, 100, 100).data
                    const hex = []
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i]
                        const g = data[i + 1]
                        const b = data[i + 2]
                        const a = data[i + 3]
                        if (a !== 0) {
                            const rgb = (r << 16) | (g << 8) | b
                            hex.push(`#${rgb.toString(16)}`)
                        }
                    }
                    return [...new Set(hex)]
                } catch (e) {
                    console.log(e)
                }
                    }

                    const mostUsed = async function (url: any) {
                        try {
                        const { createCanvas, loadImage } = require('canvas')
                        const canvas = createCanvas(100, 100)
                        const ctx = canvas.getContext('2d')
                        const image = await loadImage(url.replace(".webp", ".png").replace(".gif", ".png").replace(".jpg", ".png").replace(".jpeg", ".png"))
                        ctx.drawImage(image, 0, 0, 100, 100)
                        const data = ctx.getImageData(0, 0, 100, 100).data
                        const hex = []
                        for (let i = 0; i < data.length; i += 4) {
                            const rgb = [data[i], data[i + 1], data[i + 2]]
                            const color = rgb.map((x) => {
                            const hex = x.toString(16)
                            return hex.length === 1 ? '0' + hex : hex
                            }).join('')
                            hex.push(color)
                        }
                        return hex;
                    } catch (e) {
                        console.log(e)
                    }
                    }

                    const hexes = await color(image) as any;
                    
                    if(!hexes) return message.reply({ content: "Please specify a valid image!" })
                    
                    const file = new Discord.AttachmentBuilder(Buffer.from(hexes.join(", ")), { name: "hexes.txt" })

                    const msg = await message.reply({ content: `• *Calculating the most used hex*`, files: [file] })

                    const mostUsedHex = await mostUsed(image);

                    if(!mostUsedHex) return message.reply({ content: "Please specify a valid image!" })

                    const mostUsedColor = mostUsedHex.sort((a: any, b: any) =>
                        mostUsedHex.filter((v: any) => v === a).length -
                        mostUsedHex.filter((v: any) => v === b).length
                    ).pop();

                    const canvas = Canvas.createCanvas(700, 100);
                    const ctx = canvas.getContext('2d');
    
                    ctx.fillStyle = `#${mostUsedColor}80`;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, 100);
                    ctx.lineTo(700, 100);
                    ctx.lineTo(700, 0);
                    ctx.lineTo(0, 0);
                    ctx.strokeStyle = `rgba(0, 0, 0, 0)`;
                    ctx.lineJoin = "round";
                    ctx.lineWidth = 40;
                    ctx.stroke();
                
                    ctx.font = "40px sans-serif";
                    ctx.fillStyle = "#ffffff";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(`${mostUsedColor}`, 350, 50);

                    const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), { name: "colorcanva.png" });

                    await msg.edit({ content: `• Below is the most used hex color!`, files: [file, attachment] })
            }
            if(message.content.startsWith("!channelinfo")) {
                const channel = message.mentions.channels.first() as any || message.channel as any;

                // create a canvas card with the channel info
                const canvas = Canvas.createCanvas(700, 450);
                const ctx = canvas.getContext('2d');

                ctx.fillStyle = "#2c2f33";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, 450);
                ctx.strokeStyle = "#f1c40f";
                ctx.lineWidth = 15;
                ctx.stroke();

                // draw all the text in collumns
                ctx.font = "20px sans-serif";
                ctx.fillStyle = "#ffffff";
                ctx.fillText(`Name:`, 30, 50);
                ctx.fillText(`ID:`, 30, 100);
                ctx.fillText(`Type:`, 30, 150);
                ctx.fillText(`Status:`, 30, 200);
                ctx.fillText(`Topic:`, 30, 250);
                ctx.fillText(`Position:`, 30, 300);
                ctx.fillText(`Creation:`, 30, 350);
                ctx.fillText(`Slowmode:`, 30, 500);

                // draw all the text in collumns
                ctx.font = "20px sans-serif";
                ctx.fillStyle = "#1f8b4c";
                ctx.fillText(`${channel.name}`, 150, 50);
                ctx.fillText(`${channel.id}`, 150, 100);
                ctx.fillText(`${channel.type}`, 150, 150);
                ctx.fillText(`${channel.nsfw ? "NSFW" : "SFW"}`, 150, 200);
                ctx.fillText(`${channel.topic ? channel.topic.length > 20 ? channel.topic.substring(0, 20) + "..." : channel.topic : "No topic"}`, 150, 250);
                ctx.fillText(`${channel.rawPosition}`, 150, 300);
                ctx.fillText(`${new Date(channel.createdAt).toLocaleDateString()} • ${new Date(channel.createdAt).toLocaleTimeString()}`, 150, 350);
                ctx.fillText(`${channel.rateLimitPerUser}`, 150, 500);

                //draw the footer and keep it in the middle
                ctx.font = "30px sans-serif";
                ctx.fillStyle = "#ffffff";
                ctx.textAlign = "center";
                ctx.fillText(`${message.guild.name} • Channel Info`, canvas.width / 2, 400);

                const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), { name: "channelinfo.png" });

                message.reply({ content: `Here is the info for ${channel}`, files: [attachment] })
            }
        }

        //Private Dev Stuff
        const devIds = ["693553429380857978", "1078770321240375347", "705048027865415690"]
        if(devIds.includes(message.author.id)) {
            if(message.content == '!pm2-list') {
                let array = [] as any;
                pm2.list(function(err: any, list: any) {
                    if (err) {
                        console.error(err);
                        process.exit(2);
                    }
                    list.forEach(function(proc: any) {
                        let air = proc.pm2_env.NODE_ENV == "production" ? "✅" : "❌";
                        array.push(`• ${proc.name}\n - Status: ${proc.pm2_env.status}\n - Restarts: ${proc.pm2_env.restart_time}\n - Production: ${air}`)
                    });
                    const currentPm2 = process.env.PM2_PROCESS_NAME || 'local';
                    message.reply({ content: `You are on: ${currentPm2} \`\`\`\n${array.join("\n")}\n\`\`\`` })
                });

            }
            if(message.content.startsWith("!pm2-info")) {
                const name = message.content.split(" ").slice(1).join(" ");

                if(!name) return message.reply({ content: "Please specify a name!" })

                pm2.describe(name, function(err: any, proc: any) {
                    if (err) {
                        console.error(err);
                        process.exit(2);
                    }
                    message.reply({ content: `• ${proc[0].name}\n - Status: ${proc[0].pm2_env.status}\n - Restarts: ${proc[0].pm2_env.restart_time}\n - Production: ${proc[0].pm2_env.NODE_ENV == "production" ? "✅" : "❌"}` })
                });
            }
            if(message.content.startsWith("!pm2-restart")) {
                const name = message.content.split(" ").slice(1).join(" ");

                if(!name) return message.reply({ content: "Please specify a name!" })

                pm2.restart(name, function(err: any, proc: any) {
                    if (err) {
                        console.error(err);
                        process.exit(2);
                    }
                    message.reply({ content: `Restarted ${name}!` })
                });
            }
            if(message.content.startsWith("!pm2-delete")) {
                const name = message.content.split(" ").slice(1).join(" ");

                if(!name) return message.reply({ content: "Please specify a name!" })

                pm2.delete(name, function(err: any, proc: any) {
                    if (err) {
                        console.error(err);
                        process.exit(2);
                    }
                    message.reply({ content: `Deleted ${name}!` })
                });
            }
            if(message.content.startsWith("!pm2-stop")) {
                const name = message.content.split(" ").slice(1).join(" ");

                if(!name) return message.reply({ content: "Please specify a name!" })

                pm2.stop(name, function(err: any, proc: any) {
                    if (err) {
                        console.error(err);
                        process.exit(2);
                    }
                    message.reply({ content: `Stopped ${name}!` })
                });
            }
            if(message.content.startsWith("!eval")) {
                const evalCode = message.content.split(" ").slice(1).join(" ");

                if(!evalCode) return message.reply({ content: "Please specify a code to eval!" })

                try {
                    const evalResult = await eval(evalCode);

                    message.reply({ content: `Result:\n\`\`\`${evalResult}\`\`\`` })
                } catch (error) {
                    return message.reply({ content: `Error:\n\`\`\`${error}\`\`\`` })
                }
            }
            if(message.content.startsWith("!get-file")) {
                const path = message.content.split(" ").slice(1).join(" ");

                if(!path) return message.reply({ content: "Please specify a path!" })

                try {
                const fileContent = require("fs").readFileSync(path)

                const attachment = new Discord.AttachmentBuilder(fileContent, { name: path });

                message.reply({ content: `Here is the file`, files: [attachment] })
                } catch (error) {
                    return message.reply({ content: `Error:\n\`\`\`${error}\`\`\`` })
                }
            }
            if(message.content == "!restart-bot") {
                await message.reply({ content: "Restarting bot..." }).then(() => process.exit(0));
            }
            if(message.content == "!load") {
                const btnMsg = await message.reply({ content: "What module should I load?", components: [{ type: 1, components: [{ type: 3, custom_id: "load", options: [
                    { label: "Staff-Questions-Module", value: "staff_support", description: "Load the employee-questions embed module", emoji: { name: "❔" } },
                    { label: "Code-Questions-Module", value: "code_supportx", description: "Load the code-questions embed module", emoji: { name: "📊" } },
            ] }] }] })
                const filter = (i: any) => i.user.id === message.author.id;
                const collector = btnMsg.createMessageComponentCollector({ filter, time: 15000 });
                collector.on('collect', async (i: any) => {
                    if (i.customId === 'load') {
                        if(i.values[0] == "staff_support") {
                            /*i.message.edit({ content: "Loading...", components: [] })*/

                            (message.channel as any).send({ embeds: [{ 
                                color: 103281, 
                                author: { name: "Azury Studios Staff Questions", icon_url: message.guild.iconURL() } ,
                                description: "Dear staff members,\n\nWe understand that you may have questions or need assistance with various aspects of your work. To make things easier for you, we have created a selectmenu below that includes pre-made FAQ questions and answers. Simply select the question that best fits your query, and you will find the relevant answer.\n\nIf you don't find what you need in the selectmenu, don't worry. You can always open a thread to get support from our ownership team. We are here to help you in any way we can, so please don't hesitate to reach out.",
                            }], components: [{ type: 1, components: [{ type: 3, custom_id: "staff_support", options: [
                                { label: "How do I get started?", value: "staff_support_1", description: "How do I get started?", emoji: { name: "👋" } },
                                { label: "How do I get promoted?", value: "staff_support_3", description: "How do I get promoted?", emoji: { name: "📈" } },
                                { label: "How do I get fired?", value: "staff_support_4", description: "How do I get fired?", emoji: { name: "🔥" } },
                                { label: "I need more support!", value: "staff_support_5", description: "I need more support, I wish to open a thread!", emoji: { name: "🎫" } },
                            ] }] }] })

                            /*i.message.edit({ content: "Loaded the Staff-Questions-Module!", components: [] }).then(async(m: any) => {
                                setTimeout(async() => {
                                    await m.delete()
                                }, 5000)
                            })*/

                            //Get the interactions from interactionCreate.ts

                            collector.stop();
                        } else if(i.values[0] == "code_supportx") {
                            //i.message.edit({ content: "Loading...", components: [] })

                            (message.channel as any).send({ embeds: [{ 
                                color: 103281,
                                author: { name: "Azury Studios Code Support", icon_url: message.guild.iconURL() } ,
                                description: "Dear community, If you are in need or ever need coding help or support, you can always open a thread in the #code-help channel. We have a team of experienced developers that are willing to help you with any coding related questions you may have. We are here to help you in any way we can, so please don't hesitate to reach out.",
                            }], components: [{ type: 1, components: [{ type:2, custom_id: "code_supports", style: 1, label: "Open a thread", emoji: { name: "🎫" } }, { type:2, custom_id: "rrole_1082716973231788155", style: 2, label: "Become support" }] }] })

                            /*i.message.edit({ content: "Loaded the Code-Questions-Module!", components: [] }).then(async(m: any) => {
                                setTimeout(async() => {
                                    await m.delete()
                                }, 5000)
                            })*/

                            //Get the interactions from interactionCreate.ts

                            collector.stop();
                        }
                    }
                });
                collector.on('end', async (collected: any, reason: any) => {
                    if (reason === 'time') {
                        btnMsg.edit({ content: "You took too long to respond.", components: [] });
                    }
                });
                
            }
        }
    }
}

function levenshteinDistance(s1: string, s2: string): number {
    const m = s1.length;
    const n = s2.length;
    const d: number[][] = [];
  
    for (let i = 0; i <= m; i++) {
      d[i] = [];
      d[i][0] = i;
    }
  
    for (let j = 0; j <= n; j++) {
      d[0][j] = j;
    }
  
    for (let j = 1; j <= n; j++) {
      for (let i = 1; i <= m; i++) {
        if (s1[i - 1] === s2[j - 1]) {
          d[i][j] = d[i - 1][j - 1];
        } else {
          d[i][j] = Math.min(
            d[i - 1][j] + 1,
            d[i][j - 1] + 1,
            d[i - 1][j - 1] + 1
          );
        }
      }
    }
  
    return d[m][n];
  }
  
  function closestMatch(str: string, arr: string[]): string {
    let minDistance = Infinity;
    let closestStr = '';
  
    for (let i = 0; i < arr.length; i++) {
      const distance = levenshteinDistance(str, arr[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closestStr = arr[i];
      }
    }
  
    return closestStr;
  }

export default event