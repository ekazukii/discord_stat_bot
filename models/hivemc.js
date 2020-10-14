const request = require('request');

module.exports = class HivemcModel {
  constructor() {

  }

  getUserStats(options, callback) {
    var username = options.username;
    var response = {}
    request('http://api.hivemc.com/v1/player/'+username+'/HIDE', { json: true }, (err1, res1, body1) => {
      if (err1) { return console.log(err1); }
      if (typeof body1.code === 'undefined') {
        response.hide = res1.body.victories
        request('http://api.hivemc.com/v1/player/'+username+'/GRAV', { json: true }, (err2, res2, body2) => {
          if (err2) { return console.log(err2); }
          response.grav = res2.body.victories
          request('http://api.hivemc.com/v1/player/'+username+'/BP', { json: true }, (err3, res3, body3) => {
            if (err3) { return console.log(err3); }
            response.blockparty = res3.body.victories
            request('http://api.hivemc.com/v1/player/'+username+'/DR', { json: true }, (err4, res4, body4) => {
              if (err4) { return console.log(err4); }
              response.deathrun = res4.body.victories
              callback(response);
            });
          });
        });
      } else {
        response.error = true;
        response.error_desc = "user not found";
        callback(response);
      }
    });
  }
}
