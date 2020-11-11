import { View } from "./view";
import {ErrorResponse, HivemcStats} from "../types";
/**
 * View of Hivemc command
 * @extends View
 */
export class HivemcView extends View {

    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    constructor(bot: any) {
        super(bot)
    }

    /**
     * Callback an {@link Embed} message with user statistics
     * @param {HivemcStats} stats 
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    showUserStats(stats: HivemcStats, lang: string, callback: Function) {
        var language = require(`../../resources/lang/${lang}.json`).hivemc;
        var message = this.getEmbed()
        message.embed.title = language.statsTitle.replace("{arg1}", stats.username);
        message.embed.fields.push({
            name: language.statsHideAndSeek,
            value: stats.hide
        }, {
            name: language.statsGravity,
            value: stats.grav
        }, {
            name: language.statsBlockparty,
            value: stats.blockparty
        }, {
            name: language.statsDeathrun,
            value: stats.deathrun
        });
        callback(message);
    }

    /**
     * Callback an {@link Embed} message with user not found error
     * @param {ErrorResponse} err - Error information 
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     * @todo Handle rate exceeded error
     */
    printError(err: ErrorResponse, lang: string, callback: Function) {
        var language = require(`../../resources/lang/${lang}.json`).error;
        var message = this.getEmbedError()
        message.embed.title = language.errorTitle
        message.embed.fields.push({
            name: language.errorFieldName,
            value: language.errorFieldValue
        });
        callback(message);
    }
}
