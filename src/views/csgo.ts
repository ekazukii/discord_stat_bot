import { View } from "./view";
import {ErrorResponse, CSGOStats} from "../types";
/**
 * View of Counter Strike : Global Offensive command
 * @extends View
 */
export class CSGOView extends View {

    /**
     * @param {DiscordUser} bot - User property of bot instance
     */
    constructor(bot: any) {
        super(bot)
    }

    /**
     * Callback an {@link Embed} message with user statistics
     * @param {CSGOStats} stats 
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    showUserStats(stats: CSGOStats, lang: string, callback: Function) { 
        var language = require(`../../resources/lang/${lang}.json`).csgo;
        var message = this.getEmbed();
        message.embed.title = language.statsTitle.replace("{arg1}", stats.username);
    
        message.embed.fields.push({
            name: language.lvlName,
            value: stats.lvl,
            inline: true
        }, {
            name: language.eloName,
            value: stats.elo,
            inline: true
        }, {
            name: language.winName,
            value: stats.win + " %",
            inline: true
        }, {
            name: language.hsName,
            value: stats.hs + " %",
            inline: true
        }, {
            name: language.kdName,
            value: stats.kd,
            inline: true
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
        var message = this.getEmbedError();
        message.embed.title = language.errorTitle;
        if(err.error_desc === "User don't play csgo") {
            message.embed.fields.push({
                name: language.errorFieldName,
                value: language.errorFieldValueNotPlayingCSGO
            });
        } else {
            message.embed.fields.push({
                name: language.errorFieldName,
                value: language.errorFieldValue
            });
        }
        callback(message);
    }
}