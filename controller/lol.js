const LoLView = require("../views/lol.js");
const LoLModel = require("../models/lol.js");

module.exports = class LoLController {
    constructor(client, apikey) {
        this.client = client;
        this.model = new LoLModel(apikey);
        this.view = new LoLView(client.user);
    }

    command(args, callback) {
        this.userStats(args[0], callback);
    }

    userStats(username, callback) {
        var self = this;
        this.model.getUserStats({username: username}, function(stats) {
            stats.username = username
            if (stats.error) {
            self.view.printError(stats, function(embed) {
                // TODO : log
                callback(embed)
            })
            } else {
            self.view.showUserStats(stats, function(embed) {
                // TODO : log
                callback(embed)
            })
            }
        });
    }
}
