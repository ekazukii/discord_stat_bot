const HivemcView = require("../views/hivemc.js");
const HivemcModel = require("../models/hivemc.js");

/** Controller for hivemc command */
class HivemcController {

    /**
     * @todo Instanciate model and view in constructor.
     * @param {DiscordClient} client 
     */
    constructor(client) {
        this.client = client;
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
     * @param {string} username - Minecraft username
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    userStats(username, lang, callback) {
        var client = this.client;
        var model = new HivemcModel();
        var view = new HivemcView(client.user);
        model.getUserStats({username: username}, function(stats) {
            stats.username = username
            if (stats.error) {
                view.printError(stats, lang, function(embed) {
                    callback(embed)
                })
            } else {
                view.showUserStats(stats, lang, function(embed) {
                    callback(embed)
                })
            }
        });
    }
}

module.exports = HivemcController;
