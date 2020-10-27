const View = require("./view.js");

/**
 * View of Lang command
 * @extends View
 */
class CoinflipView extends View {
    constructor(bot) {
        super(bot);
    }

    /**
     * Callback an {@link Embed} message with either Heads or Tails
     * @param {number} winner - Either 0 or 1 (0 --> Heads, 1 --> Tails)
     * @param {string} lang - New language of the discord bot 
     * @param {messageCallback} callback  
     */
    showCoinflip(winner, lang, callback) {
        var language = require(`./lang/${lang}.json`).coinflip;
        var options = [language.heads, language.tails];
        var message = this.getEmbed();
        message.embed.title = language.coinflipTitle;
        message.embed.fields.push({
            name: "************",
            value: language.coinflipValue.replace("{arg1}", options[winner])
        });

        callback(message);
    }

    /**
     * Callback an {@link Embed} message with the option chosen among the list
     * @param {Array<string>} options - List of options
     * @param {index} winner - Index of the picked option.
     * @param {string} lang - New language of the discord bot 
     * @param {messageCallback} callback  
     */
    showPickOption(options, winner, lang, callback) {
        var language = require(`./lang/${lang}.json`).coinflip;
        var message = this.getEmbed();
        message.embed.title = language.pickTitle;
        message.embed.fields.push({
            name: language.pickFieldName.replace("{arg1}", options.join(" , ")),
            value: language.pickFieldValue.replace("{arg1}", options[winner])
        });

        callback(message);
    }
}

module.exports = CoinflipView;
