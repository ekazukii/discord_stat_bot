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
  command(args, lang, callback) {
    this.userStats(args[0], lang, callback);
  }


  userStats(username, lang, callback) {
    var client = this.client;
    var model = new WynncraftModel()
    var view = new WynncraftView(client.user)
    model.getUserStats({username: username}, function(stats) {
      stats.username = username
      if (stats.error) {
        view.printError(stats, lang, function(embed) {
          // TODO : log
          callback(embed);
        })
      } else {
        // TODO : log
        view.showUserStats(stats, lang, function(embed) {
          callback(embed);
        })
      }
    });
  }
}
