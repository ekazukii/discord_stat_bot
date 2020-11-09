const OWView = require("../views/ow.js");
const OWModel = require("../models/ow.js");

/** Controller for Overwatch command */
class OWController {

    /**
     * @todo Instanciate model and view in constructor.
     * @param {DiscordClient} client 
     */
    constructor(client) {
        this.model = new OWModel();
        this.view = new OWView(client.user);
    }

    /**
     * Process command with command arguments
     * @param {Array} args 
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    command(args, lang, callback) {
        if(args[0] === "search") {
            this.searchUser(args, lang, callback);
        } else if(args[0] === "profile") {
            this.userStats(args, lang, callback);
        }
    }

    /**
     * Ask the model to search user with specific username and send them to the view, then callback the message created in view
     * @param {array} args - Commands arguments
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    searchUser(args, lang, callback) {
        this.model.searchPublicUsers({username: args[1]}, (stats) => {
            stats.username = args[1];
            if(stats.users.length > 0) {
                this.view.showSearch(stats, lang, (embed) => {
                    callback(embed);
                });
            } else {
                stats.error = true;
                stats.error_desc = "User not found";

                this.view.printError(stats, lang, (embed) => {
                    callback(embed);
                });
            }

        });
    }

    /**
     * Ask the model to fetch statistics and send them to the view, then callback the message created in view
     * @param {string} args - Commands arguments
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    userStats(args, lang, callback) {
        var self = this;
        this.model.getUserStats({username : args[1], platform: args[2]}, (stats) => {
            if(stats.error) {
                self.view.printError(stats, lang, (embed) => {
                    callback(embed);
                });
            } else {
                self.view.showUserStats(stats, lang, (embed) => {
                    callback(embed);
                });
            }
        });
    }
}

module.exports = OWController;
