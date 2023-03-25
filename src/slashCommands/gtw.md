import { SlashCommandBuilder, ChannelType, EmbedBuilder, APIEmbedField, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, PermissionFlagsBits} from "discord.js"
import { getThemeColor } from "../functions";
import { readdirSync } from "fs"
import { SlashCommand } from "../types";
import { TextChannel } from 'discord.js';
import {Events} from "discord.js";
import GtwDB from "../Schema/gtw";


const GtwCmd : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("gtw")
    .setDescription("Setup a new Guess The Word Event!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: async (interaction, client) => {
       

		

const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
            new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`gtwStart`)
            .setLabel(`Start your event!`)
            .setEmoji(`⏲`),
        ])


		
let globMsg = await interaction.reply({
	content: "A new event has going to get started!", fetchReply: true, embeds: [new EmbedBuilder()
		.setAuthor({
			name: `${interaction.user.tag} is starting a event!`
		})	
        .setTitle("This event is Guess The Word, a special hosted event for you to participate in. Guess the word correctly and you win!")
        .setDescription("Your goal is to successfully guess the word correctly! Just rely on your luck.")
        .addFields([
            {
            name: "Rewards 🌟",
            value: "Whoever is hosting this event can choose if their is rewards or not. However the owner can show or provide rewards below"
            },
            {
                name: "When is this starting 🕣",
                value: "The hoster has the option to start the event or not. Please be patient"
            }

    ]
    )
        .setFooter({text: "With that all being said. Enjoy this event!"})
        ]
})		

let dashMsg = await interaction.followUp({
    components: [row], content: "**Ready?**", ephemeral: true
})

      
client.on(Events.InteractionCreate, async (i: any) => {




    if (i.isButton()) {
        if (!i.customId.startsWith('gtw')) return;

        if(i.user?.id != interaction.user?.id) return;
       
        const f = require("node-fetch")

        const apiUrl = `https://random-word-api.herokuapp.com/word`

        let q = await new f(`${apiUrl}`)

		const fetchApi = await q.json()

		
let wordValue = fetchApi[0];

console.log(wordValue);

	if(i.customId == "gtwStart"){


globMsg.edit({
      content: "Events starting now!", components: [], embeds: [new EmbedBuilder()
		.setAuthor({
			name: `${interaction.user.tag} is starting a event!`
		})	
        .setTitle("This event is Guess The Word, a special hosted event for you to participate in.")
        .setDescription("Your goal is to successfully guess the word correctly! Just rely on your luck.")
        .addFields([
            {
            name: "Rewards 🌟",
            value: "Whoever is hosting this event can choose if their is rewards or not. However the owner can show or provide rewards below"
            },
            {
                name: "When is this starting 🕣",
                value: "The hoster has the option to start the event or not. Please be patient"
            }

    ]
    )
        .setFooter({text: "With that all being said. Enjoy this event!"})
    ]
});
				
await (new GtwDB({

Word: wordValue,  
HasEnded: "no"  

}).save());

let data = await GtwDB.findOne({
    Word: wordValue,
});

interaction.followUp({
	content: `Started! Heres your word and following hints \n Word: ${data?.Word} \n Hint 1: ${data?.Word?.substring(0, 1)} \n Hint 2: ${data?.Word?.substring(0, 2)} \n Hint 3: ${data?.Word?.substring(0, 3)} `, components: [], ephemeral: true
})						


i.channel.send(`Your first hint is ${data?.Word?.substring(0, 1)}! Good luck!`).then(async (m: any) => {

m.pin()

})

const TimeOutId1 = setTimeout(() => {
    i.channel.send(`Seems like theres been no progress so far guys! So heres Hint 2: **${data?.Word.substring(0,2)}**`).then((m: any) => {
        m.pin()
    })
}, 300000);



const TimeOutId2 = setTimeout(() => {
    i.channel.send(`No progress still! Last Hint, find out and test your luck! So heres Hint 3: **${data?.Word.substring(0,3)}**`).then((m: any) => {
        m.pin()
    })
}, 600000);



client.on(Events.MessageCreate, async (m: any) => {
if(m.author.bot) return;


let dataFind = await GtwDB.findOne({
    Word: wordValue,
    HasEnded: "yes",
});

if(!dataFind){
    if(m.content?.includes(`${data?.Word}`)){
        m.channel.send(`${m.author.tag} has won this event. The word was ${data?.Word}! The event is currently over. Any rewards for winners of the event shall be given!`).then(() => {
            m.pin()
        })
        const filter = { Word: wordValue, HasEnded: "no" };
const update = { HasEnded: "yes" };

await GtwDB.findOneAndUpdate(filter, update, {
    new: true
  });

  clearTimeout(TimeOutId1);
  clearTimeout(TimeOutId2);
  }
}

if(dataFind) {

    clearTimeout(TimeOutId1);
    clearTimeout(TimeOutId2);
    return;


}
})
					}

	}	
})      
    },
    cooldown: 50
}

export default GtwCmd