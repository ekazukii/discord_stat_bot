const HivemcView = require("../views/hivemc.js");
const HivemcModel = require("../models/hivemc.js");

module.exports = class HivemcController {
  constructor(client) {
    this.client = client;
  }

  command(args, callback) {
    this.userStats(args[0], callback);
  }

  userStats(username, callback) {
    var client = this.client;
    var model = new HivemcModel();
    var view = new HivemcView(client.user);
    model.getUserStats({username: username}, function(stats) {
      stats.username = username
      if (stats.error) {
        view.printError(stats, function(embed) {
          // TODO : log
          callback(embed)
        })
      } else {
        view.showUserStats(stats, function(embed) {
          // TODO : log
          callback(embed)
        })
      }
    });
  }
}
