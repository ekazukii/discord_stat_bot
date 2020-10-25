const HivemcView = require("../views/hivemc.js");
const HivemcModel = require("../models/hivemc.js");

module.exports = class HivemcController {
  constructor(client) {
    this.client = client;
  }

  command(args, lang, callback) {
    this.userStats(args[0], lang, callback);
  }

  userStats(username, lang, callback) {
    var client = this.client;
    var model = new HivemcModel();
    var view = new HivemcView(client.user);
    model.getUserStats({username: username}, function(stats) {
      stats.username = username
      if (stats.error) {
        view.printError(stats, lang, function(embed) {
          // TODO : log
          callback(embed)
        })
      } else {
        view.showUserStats(stats, lang, function(embed) {
          // TODO : log
          callback(embed)
        })
      }
    });
  }
}
