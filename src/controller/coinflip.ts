import {CoinflipView} from "../views/coinflip.js";

/** Controller for CoinFlip command */
export class CoinflipController {

    client: any
    /**
     * @todo Instanciate view in constructor.
     * @param {DiscordClient} client 
     */
    constructor(client: any) {
        this.client = client;
    }

    /**
     * Process command with command arguments and do either CoinflipController#coinflip either CoinflipController#pickOption
     * @param {Array<string>} args - Command arguments
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    command(args: Array<string>, lang: string, callback: Function) {
        if (args.length > 1) {
            this.pickOption(args, lang, callback)
        } else {
            this.coinflip(lang, callback);
        }
    }

    /**
     * Do a coinflip and send result to view, then callback embed message.
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    coinflip(lang: string, callback: Function) {
        var client = this.client;
        var view = new CoinflipView(client.user)
        var winner = getRandomInt(2);

        view.showCoinflip(winner, lang, (embed: any) => {
            callback(embed)
        })

    }

    /**
     * Pick randomly an argument in the args Array
     * @param {Array<string>} args - Command arguments 
     * @param {string} lang - Current language of the bot 
     * @param {messageCallback} callback 
     */
    pickOption(args: Array<string>, lang: string, callback: Function) {
        var client = this.client;
        var view = new CoinflipView(client.user)
        var winner = getRandomInt(args.length);

        view.showPickOption(args, winner, lang, (embed: any) => {
            callback(embed)
        })
    }
}

/**
 * get random integer from 0 to max
 * @param {number} max 
 */
function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}
