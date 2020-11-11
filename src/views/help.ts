import { View } from "./view";

/**
 * View of Help command
 * @extends View
 */
export class HelpView extends View {

    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    constructor(bot: any) {
        super(bot)
    }

    showHelp(lang: string, callback: Function) {
        var language = require(`../../resources/lang/${lang}.json`).help;
        var message = this.getEmbed()
        message.embed.title = language.helpTitle;
        message.embed.fields.push({
            name: language.helpName,
            value: "https://ekazuki.fr/discord#commands"
        });
        callback(message);
    }

}

