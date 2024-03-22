const itemsTranslation = require("../../itens.json");

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

module.exports = translateItems 