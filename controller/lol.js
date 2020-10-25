const LoLView = require("../views/lol.js");
const LoLModel = require("../models/lol.js");

module.exports = class LoLController {
    constructor(client, apikey) {
        this.client = client;
        this.model = new LoLModel(apikey);
        this.view = new LoLView(client.user);
    }

    command(args, lang, callback) {
        switch (args[0]) {
            case "profile":
                this.userStats(args[1].replace(/\$/, " "), lang, callback);
                break;
            case "vs":
                this.comparePlayers(args[1].replace(/\$/, " "), args[2].replace(/\$/, " "), lang, callback);
                break;
            case "cs":
                this.userCS(args[1].replace(/\$/, " "), lang, callback);
                break;
            case "rotation":
                this.championRotation(lang, callback);
                break;
            default:
                break;
        }
    }

    comparePlayers(user1, user2, lang, callback) {
        var self = this;
        this.model.comparePlayers({user1: user1, user2: user2}, (stats) => {
            stats.user1 = user1;
            stats.user2 = user2;
            if (stats.error) {
                self.view.printError(stats, lang, function(embed) {
                    callback(embed)
                });
            } else {
                self.view.showUsersComparation(stats, lang, function(embed) {
                    callback(embed)
                });
            }
        });
    }

    userStats(username, lang, callback) {
        var self = this;
        this.model.getUserStats({username: username}, function(stats) {
            stats.username = username
            if (stats.error) {
                self.view.printError(stats, lang, function(embed) {
                    // TODO : log
                    callback(embed)
                });
            } else {
                self.view.showUserStats(stats, lang, function(embed) {
                    // TODO : log
                    callback(embed)
                });
            }
        });
    }

    userCS(username, lang, callback) {
        var self = this;
        this.model.getUserCS({username: username, ngame: 5}, function(stats) {
            stats.username = username;
            if (stats.error) {
                self.view.printError(stats, lang, function(embed) {
                    // TODO : log
                    callback(embed)
                });
            } else {
                self.view.showUserCS(stats, lang, function(embed) {
                    callback(embed)
                });
            }
        });
    }

    championRotation(lang, callback) {
        var self = this;
        this.model.getChampionRotation(function(rotation) {
            if (rotation.error) {
                self.view.printError(rotation, lang, function(embed) {
                    // TODO : log
                    callback(embed)
                });
            } else {
                self.view.showChampionRotation(rotation, lang, function(embed) {
                    callback(embed)
                });
            }
        });
    }
}
