const Discord = require("discord.js");
const axios = require("axios");

const championInfo = require("../../../champion_info.json");
const itemsTranslation = require("../../../itens.json");
const spellsTranslation = require("../../../spells.json");

module.exports = {
  name: "build",
  description: "[MEMBER] Pesquise a build de um campeão.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      type: Discord.ApplicationCommandOptionType.String,
      name: "campeão",
      description: "Digite o nome ou alias do campeão",
      required: true
    },
    {
      type: Discord.ApplicationCommandOptionType.String,
      name: "rota",
      description: "Qual a rota desejada?",
      required: true
    }
  ],
  run: async (client, interaction) => {
    try {

      await interaction.deferReply();

      const championName = interaction.options.getString("campeão");
      const role = interaction.options.getString("rota");

      let championData = null;
      for (const champion of championInfo) {
        if (champion.name.toLowerCase() === championName.toLowerCase() || champion.alias.toLowerCase() === championName.toLowerCase()) {
          championData = champion;
          break;
        }
      }

      if (!championData) {
        await interaction.editReply({ content: "Campeão não encontrado. Por favor, verifique o nome ou alias do campeão e tente novamente." });
        return;
      }

      const apiUrl = "http://127.0.0.1:5000/champion_data";
      const requestData = {
        champion_name: championData.alias,
        role: role
      };

      const response = await axios.post(apiUrl, requestData);
      let buildData = response.data;

      buildData.items = translateItems(buildData.items);
      buildData.spells = translateSpells(buildData.spells);

      const embed = new Discord.EmbedBuilder()
        .setTitle(`${championData.alias}`)
        .setThumbnail(`${championData.splash}`)
        .addFields(
          { name: "Skill Order", value: buildData.skill_order.join(" - ") },
          { name: "Runes", value: buildData.runas.join("\n") },
          { name: "Stats", value: buildData.stats.join("\n") },
          { name: "Spells", value: buildData.spells.join("\n")},
          { name: "Items", value: buildData.items.map(item => `${item.item} ${item.pick_rate}`).join("\n") },
          { name: "Counters", value: buildData.counters.join(" ") }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed]});

    } catch (error) {
      console.error("Ocorreu um erro:", error);
      await interaction.editReply({ content: "Erro ao processar o comando build." });
    }
  }
};

function translateItems(items) {
  const translatedItems = items.map(item => {
    const itemName = item.item;
    const translation = itemsTranslation.find(item => item.en_us === itemName);
    if (translation && translation.pt_br) {
      return { item: translation.pt_br, pick_rate: item.pick_rate };
    }
    return item;
  });
  return translatedItems;
}

function translateSpells(spells) {
  const translatedSpells = spells.map(spell => {
    const spellName = spell.startsWith("Summoner Spell") ? spell.substring(15) : spell;
    const translation = spellsTranslation.find(item => item.en_us === spellName);
    if (translation && translation.pt_br) {
      return translation.pt_br;
    }
    return spell;
  });
  return translatedSpells;
}
