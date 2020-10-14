const request = require('request');

module.exports = class SotModel {

  constructor(xboxkey) {
    this.xboxkey = xboxkey; 
  }

  getUserStats(options, callback) {
    var username = options.username;
    var response = {}

    var options1 = {
      url: 'https://xboxapi.com/v2/xuid/'+username,
      headers: {
        'X-AUTH': this.xboxkey
      },
    }

    request(options1, (err, res, body) => {
      if (!isNaN(body)) {
        var options = {
          url: 'https://xboxapi.com/v2/'+body+'/game-stats/1717113201',
          headers: {
            'X-AUTH': this.xboxkey
          },
          json: true
        }
        request(options, (err1, res1, body1) => {
          if (typeof body1.groups !== "undefined") {
            response.chests = body1.groups[0].statlistscollection[0].stats[0].value
            response.distance = body1.groups[0].statlistscollection[0].stats[1].value
            response.quests = body1.groups[0].statlistscollection[0].stats[2].value
            response.skulls = body1.groups[0].statlistscollection[0].stats[3].value
            response.crates = body1.groups[0].statlistscollection[0].stats[4].value
            response.isles = body1.groups[0].statlistscollection[0].stats[5].value
          } else {
            response.error = true;
            response.error_desc = "not playing sot"
          }
          callback(response)
        });
      } else {
        response.error = true
        response.error_desc = "user not found"
        callback(response)
      }
    });
  }
}
