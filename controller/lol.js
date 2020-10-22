const LoLView = require("../views/lol.js");
const LoLModel = require("../models/lol.js");

module.exports = class LoLController {
    constructor(client, apikey) {
        this.client = client;
        this.model = new LoLModel(apikey);
        this.view = new LoLView(client.user);
    }

    command(args, callback) {
        switch (args[0]) {
            case "profile":
                this.userStats(args[1], callback);
                break;
            case "vs":
                this.comparePlayers(args[1], args[2], callback);
                break;
            case "cs":
                this.userCS(args[1], callback);
                break;
            case "rotation":
                this.championRotation(callback);
                break;
            default:
                break;
        }
    }

    comparePlayers(user1, user2, callback) {
        var self = this;
        this.model.comparePlayers({user1: user1, user2: user2}, (stats) => {
            stats.user1 = user1;
            stats.user2 = user2;
            if (stats.error) {
                self.view.printError(stats, function(embed) {
                    callback(embed)
                });
            } else {
                self.view.showUsersComparation(stats, function(embed) {
                    callback(embed)
                });
            }
        });
    }

    userStats(username, callback) {
        var self = this;
        this.model.getUserStats({username: username}, function(stats) {
            stats.username = username
            if (stats.error) {
                self.view.printError(stats, function(embed) {
                    // TODO : log
                    callback(embed)
                });
            } else {
                self.view.showUserStats(stats, function(embed) {
                    // TODO : log
                    callback(embed)
                });
            }
        });
    }

    userCS(username, callback) {
        var self = this;
        this.model.getUserCS({username: username, ngame: 5}, function(stats) {
            stats.username = username;
            if (stats.error) {
                self.view.printError(stats, function(embed) {
                    // TODO : log
                    callback(embed)
                });
            } else {
                self.view.showUserCS(stats, function(embed) {
                    callback(embed)
                });
            }
        });
    }

    championRotation(callback) {
        var self = this;
        this.model.getChampionRotation(function(rotation) {
            if (rotation.error) {
                self.view.printError(rotation, function(embed) {
                    // TODO : log
                    callback(embed)
                });
            } else {
                self.view.showChampionRotation(rotation, function(embed) {
                    callback(embed)
                });
            }
        });
    }
}
