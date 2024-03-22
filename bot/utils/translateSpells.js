const spellsTranslation = require("../../spells.json")

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

module.exports = translateSpells 