const Discord = require("discord.js");

module.exports = {
  name: "build",
  description: "[MEMBER] Pesquise a build de um campeão.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      type: Discord.ApplicationCommandOptionType.String,
      name: "campeão",
      description: "Digite o nome do campeão",
      required: true
    },
    {
      type: Discord.ApplicationCommandOptionType.String,
      name: "rota",
      description: "Qual a rota desejada?",
      required: true
  }
    ],
  run: async (client,interaction) => {

    try {
      
      await interaction.deferReply({ ephemeral: true });

   
    } catch (error) {

      await interaction.reply({ content: "Erro ao processar o comando build.", ephemeral: true });

    }
  }
};