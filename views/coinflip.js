const View = require("./view.js");
const language = require("./lang/fr_FR.json").coinflip;

module.exports = class CoinflipView extends View {
    constructor(bot) {
        super(bot);
    }

    showCoinflip(winner, callback) {
        var options = [language.heads, language.tails];
        var message = this.getEmbed();
        message.embed.title = language.coinflipTitle;
        message.embed.fields.push({
            name: "************",
            value: language.coinflipValue.replace("{arg1}", options[winner])
        });

        callback(message);
    }

    showPickOption(options, winner, callback) {
        var message = this.getEmbed();
        message.embed.title = language.pickTitle;
        message.embed.fields.push({
            name: language.pickFieldName.replace("{arg1}", options.join(" , ")),
            value: language.pickFieldValue.replace("{arg1}", options[winner])
        });

        callback(message);
    }
}
