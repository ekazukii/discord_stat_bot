const request = require('request');

module.exports = class Monserv {
  constructor() {

  }

  getPlayersOnline(callback) {
    request('https://panel.omgserv.com/json/218018/players', { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      var id = body.id.substr(0,8) + "-" + body.id.substr(8,4) + "-" + body.id.substr(12,4) + "-" + body.id.substr(16,4) + "-" + body.id.substr(20)
      callback(id);
    });
  }


}
