const SotView = require("../views/sot.js");
const SotModel = require("../models/sot.js");

module.exports = class SotController {
  constructor(client) {
    this.client = client;
  }

  command(args, callback) {
    this.userStats(args[0], callback);
  }

  userStats(username, callback) {
    var client = this.client;
    var model = new SotModel()
    var view = new SotView(client.user)
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

  userAchievment(username, callback) {
    // TODO
  }

  userReputation(username, callback) {
    // TODO
  }
}
