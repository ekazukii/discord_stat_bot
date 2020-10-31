const CoCView = require("../views/coc.js");
const CoCModel = require("../models/coc.js");

/** Controller for Clash of Clans command */
class CoCController {

    /**
     * @todo Instanciate model and view in constructor.
     * @param {string} api_key - Clash of Clans API key
     * @param {DiscordClient} client 
     */
    constructor(client, api_key) {
        this.model = new CoCModel(api_key);
        this.view = new CoCView(client.user);
    }

    /**
     * Process command with command arguments (in this case always do userStats only command)
     * @param {Array} args 
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    command(args, lang, callback) {
        this.userStats(args[0], lang, callback);
    }

    /**
     * Ask the model to fetch statistics and send them to the view, then callback the message created in view
     * @param {string} tag - clash of Clans playerTag
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    userStats(tag, lang, callback) {
        var self = this;
        this.model.getUserStats({tag: tag}, function(stats) {
            stats.tag = tag
            if (stats.error) {
                self.view.printError(stats, lang, function(embed) {
                    callback(embed)
                })
            } else {
                self.view.showUserStats(stats, lang, function(embed) {
                    callback(embed)
                })
            }
        });
    }
}

module.exports = CoCController;
