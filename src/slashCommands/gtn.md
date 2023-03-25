import { SlashCommandBuilder, ChannelType, EmbedBuilder, APIEmbedField, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, PermissionFlagsBits} from "discord.js"
import { getThemeColor } from "../functions";
import { readdirSync } from "fs"
import { SlashCommand } from "../types";
import { TextChannel } from 'discord.js';
import {Events} from "discord.js";
import GtnDB from "../Schema/gtn";


const GtnCmd : SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("gtn")
    .setDescription("Setup a new Guess The Number Event!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: async (interaction, client) => {
       

		

const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
            new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setCustomId(`gtnStart`)
            .setLabel(`Start your event?`)
            .setEmoji(`⏲`),
        ])


		
let globMsg = await interaction.reply({
	content: "A new event has going to get started!", fetchReply: true, embeds: [new EmbedBuilder()
		.setAuthor({
			name: `${interaction.user.tag} is starting a event!`
		})	
        .setTitle("This event is Guess The Number, a special hosted event for you to participate in.")
        .setDescription("Your goal is to successfully guess the number correctly! Just rely on your luck.")
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
    components: [row], content: "Start?", ephemeral: true
})

      
client.on(Events.InteractionCreate, async (i: any) => {




    if (i.isButton()) {
        if (!i.customId.startsWith('gtn')) return;

        if(i.user?.id != interaction.user?.id) return;

		
let numberValue = Math.floor(Math.random() * 5000) 

	if(i.customId == "gtnStart"){


globMsg.edit({
      content: "Events starting now!", components: [], embeds: [new EmbedBuilder()
		.setAuthor({
			name: `${interaction.user.tag} is starting a event!`
		})	
        .setTitle("This event is Guess The Number, a special hosted event for you to participate in.")
        .setDescription("Your goal is to successfully guess the number correctly! Just rely on your luck.")
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


// You can change the limit as much as you want via amount
            

dashMsg.delete()
				
await (new GtnDB({

Numbers: numberValue,  
HasEnded: "no"  

}).save());

let data = await GtnDB.findOne({
    Numbers: numberValue,
});

interaction.followUp({
	content: `Started! Heres your number and following hints \n Number: ${data?.Numbers} \n Hint 1: ${data?.Numbers?.substring(0, 1)} \n Hint 2: ${data?.Numbers?.substring(0, 2)} \n Hint 3: ${data?.Numbers?.substring(0, 3)} `, components: [], ephemeral: true
})						


i.channel.send(`Your first hint is ${data?.Numbers?.substring(0, 1)}! Good luck!`).then(async (m: any) => {

m.pin()

})

const TimeOutId1 = setTimeout(() => {
    i.channel.send(`Seems like theres been no progress so far guys! So heres Hint 2: **${data?.Numbers.substring(0,2)}**`).then((m: any) => {
        m.pin()
    })
}, 300000);



const TimeOutId2 = setTimeout(() => {
    i.channel.send(`No progress still! Last Hint, find out and test your luck! So heres Hint 3: **${data?.Numbers.substring(0,3)}**`).then((m: any) => {
        m.pin()
    })
}, 600000);



client.on(Events.MessageCreate, async (m: any) => {


if(m.author.id = interaction.user?.id) return;

if(m.author.bot) return;


let dataFind = await GtnDB.findOne({
    Numbers: numberValue,
    HasEnded: "yes",
});

if(!dataFind){



   



    if(m.content?.includes(`${data?.Numbers}`)){
        m.channel.send(`${m.author.tag} has won this event. The number was ${data?.Numbers}! The event is currently over. Any rewards for winners of the event shall be given!`).then(() => {
            m.pin()
        })

      

        const filter = { Numbers: numberValue, HasEnded: "no" };
const update = { HasEnded: "yes" };

await GtnDB.findOneAndUpdate(filter, update, {
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
    cooldown: 50 // In ms
}

export default GtnCmd