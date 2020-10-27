const WynncraftView = require("../views/wynncraft.js");
const WynncraftModel = require("../models/wynncraft.js");

/** Controller for Wynncraft command */
class WynncraftController {
    
    /**
     * @todo Instanciate model and view in constructor.
     * @param {DiscordClient} client 
     */
    constructor(client) {
        this.client = client;
    }


    /**
     * Process command with command arguments (in this case always do userStats only one command)
     * @param {Array<string>} args 
     * @param  {Channel} channel [Channel]{@link https://discord.js.org/#/docs/main/stable/class/Channel} where the command was executed
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
        var model = new WynncraftModel()
        var view = new WynncraftView(client.user)
        model.getUserStats({username: username}, function(stats) {
        stats.username = username
        if (stats.error) {
            view.printError(stats, lang, function(embed) {
                callback(embed);
            })
        } else {
            view.showUserStats(stats, lang, function(embed) {
                callback(embed);
            })
        }
        });
    }
}

module.exports = WynncraftController; 
