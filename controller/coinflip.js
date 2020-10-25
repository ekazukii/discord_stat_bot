const CoinflipView = require("../views/coinflip.js");

module.exports = class CoinflipController {
  constructor(client) {
    this.client = client;
  }

  command(args, lang, callback) {
    if (args.length > 1) {
      this.pickOption(args, lang, callback)
    } else {
      this.coinflip(args, lang, callback);
    }
  }

  coinflip(args, lang, callback) {
    var client = this.client;
    var view = new CoinflipView(client.user)
    var winner = getRandomInt(2);
    /**
    view.printError(embed => {
      callback(embed)
    })*/

    view.showCoinflip(winner, lang, embed => {
      callback(embed)
    })

  }

  pickOption(args, lang, callback) {
    var client = this.client;
    var view = new CoinflipView(client.user)
    var winner = getRandomInt(args.length);

    view.showPickOption(args, winner, lang, embed => {
      callback(embed)
    })
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
