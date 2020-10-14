const request = require('request');

module.exports = class Mojang {
  constructor() {

  }

  getUUIDByUsername(options, callback) {
    var username = options.username
    request('https://api.mojang.com/users/profiles/minecraft/'+username, { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      var id = body.id.substr(0,8) + "-" + body.id.substr(8,4) + "-" + body.id.substr(12,4) + "-" + body.id.substr(16,4) + "-" + body.id.substr(20)
      callback(id);
    });
  }
}
