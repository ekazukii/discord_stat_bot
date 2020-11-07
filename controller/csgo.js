const CSGOView = require("../views/csgo.js");
const CSGOModel = require("../models/csgo.js");

/** Controller for Counter Strike : Global Offensive command */
class CSGOController {

    /**
     * @todo Instanciate model and view in constructor.
     * @param {string} api_key - Counter Strike : Global Offensive API key
     * @param {DiscordClient} client 
     */
    constructor(client, api_key) {
        this.model = new CSGOModel(api_key);
        this.view = new CSGOView(client.user);
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
     * @param {string} username - Faceit username
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    userStats(username, lang, callback) {
        var self = this;
        this.model.getUserStats({username: username}, function(stats) {
            stats.username = username;
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

module.exports = CSGOController;
