const WynncraftView = require("../views/wynncraft.js");
const WynncraftModel = require("../models/wynncraft.js");

module.exports = class WynncraftController {
  constructor(client) {
    this.client = client;
  }


  /**
   * command - Called when use that command
   *
   * @param  {Channel} channel [Channel]{@link https://discord.js.org/#/docs/main/stable/class/Channel} where the command was executed
   * @param  {Array.<strings>} args Array of arguments of the command
   */
  command(args, callback) {
    this.userStats(args[0], callback);
  }


  userStats(username, callback) {
    var client = this.client;
    var model = new WynncraftModel()
    var view = new WynncraftView(client.user)
    model.getUserStats({username: username}, function(stats) {
      stats.username = username
      if (stats.error) {
        view.printError(stats, function(embed) {
          // TODO : log
          callback(embed);
        })
      } else {
        // TODO : log
        view.showUserStats(stats, function(embed) {
          callback(embed);
        })
      }
    });
  }
}
