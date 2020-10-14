"use strict";
const request = require('request');

module.exports = class WynncraftModel {
  constructor() {

  }

  /**
  * Get statistics of given user
  * @params {Object} options - Query options
  * @params {number} [options.class=0]  - Choosed class ordered by level descending (0 is highest level class)
  * @params {string} [option.uuid] - UUID of user
  * @params {string} [option.username] - username of user
  */
  getUserStats(options, callback) {
    var username = options.username;
    var classN = 0;
    var response = {}
    request('https://api.wynncraft.com/v2/player/'+username+'/stats', { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      if (body.code === 200) {
        var mainClass = body.data[0].classes[classN]
        response.username = body.data[0].username;
        response.className = mainClass.name;
        response.classLevel = mainClass.professions.combat.level;
        response.completedDungeons = mainClass.dungeons.completed;
        response.completedQuests = mainClass.quests.completed;
        response.mobsKilled = mainClass.mobsKilled;
        callback(response);
      } else {
        response.error = true
        response.error_desc = "user not found"
        callback(response);
      }
    });
  }

  getConnectedUsers(option) {

  }

  isUserOnline() {

  }

  getBestItem() {

  }

  getItem() {

  }
}
