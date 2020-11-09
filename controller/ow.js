const OWView = require("../views/ow.js");
const OWModel = require("../models/ow.js");

/** Controller for Clash of Clans command */
class OWController {

    /**
     * @todo Instanciate model and view in constructor.
     * @param {string} api_key - Clash of Clans API key
     * @param {DiscordClient} client 
     */
    constructor(client, api_key) {
        this.model = new OWModel(api_key);
        this.view = new OWView(client.user);
    }

    /**
     * Process command with command arguments (in this case always do userStats only command)
     * @param {Array} args 
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    command(args, lang, callback) {
        if(args[0] === "search") {
            this.searchUser(args[1], lang, callback);
        } else if(args[0] === "profile") {
            this.userStats(args, lang, callback);
        }
        //this.userStats(args[0], lang, callback);
    }

    searchUser(username, lang, callback) {
        this.model.searchPublicUsers("over watch");
    }

    /**
     * Ask the model to fetch statistics and send them to the view, then callback the message created in view
     * @param {string} tag - clash of Clans playerTag
     * @param {string} lang - Current language of the bot
     * @param {messageCallback} callback 
     */
    userStats(args, lang, callback) {
        var self = this;
        //this.model.searchPublicUsers(args[2], args[1]);
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
        /*
        if(this.platforms.includes(args[1])) {
            const platform = args[1].replace("switch", "nintendo-switch")
            fetch(`https://playoverwatch.com/en-us/search/account-by-name/${args[2]}/`)
                .then(res => res.json())
                .then(json => {
                    for (let i = 0; i < json.length; i++) {
                        console.log(json[i].platform + " + " + platform);
                        if(json[i].isPublic && json[i].platform === platform) {
                            console.log(json[i]);
                        }
                    }
                });
        }

        var self = this;
        this.model.getUserStats({username: username, platform, platform}, function(stats) {
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
        */
    }
}

module.exports = OWController;
