const View = require("./view.js");

module.exports = class CoinflipView extends View {
    constructor(bot) {
        super(bot);
    }

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
