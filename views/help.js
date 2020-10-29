const View = require("./view.js");

/**
 * View of Help command
 * @extends View
 */
class HelpView extends View {

    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    constructor(bot) {
        super(bot)
    }

    showHelp(lang, callback) {
        var language = require(`./lang/${lang}.json`).help;
        var message = this.getEmbed()
        message.embed.title = language.helpTitle;
        message.embed.fields.push({
            name: language.helpName,
            value: "https://ekazuki.fr/discord#commands"
        });
        callback(message);
    }

}

module.exports = HelpView;
