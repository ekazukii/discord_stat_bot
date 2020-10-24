module.exports = function(options) {
  var dtoken = options.dicord_token;
  var xboxkey = options.xbox_key;
  var riotapi = options.riotapi;
  const Discord = require('discord.js');
  const client = new Discord.Client();
  
  require("./models/mojang.js");
  require("./models/wynncraft.js")
  require("./models/hivemc.js")
  
  require("./views/hivemc.js")
  require("./views/wynncraft.js")
  
  const WynncraftController = require("./controller/wynncraft.js");
  var wynncraftController = new WynncraftController(client);
  
  const HivemcController = require("./controller/hivemc.js");
  var hivemcController = new HivemcController(client);

  const CoinflipController = require("./controller/coinflip.js");
  var coinflipController = new CoinflipController(client);
  
  const LoLController = require("./controller/lol.js");
  var lolController;

  const mcping = require('mc-ping-updated');
  
  
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus('visible');
    lolController = new LoLController(client, riotapi);
    //client.user.setActivity("Dort paisiblement.");
  });
  
  client.on('message', rawMessage => {
    if (rawMessage.content.charAt(0) === '$') {
      var args = rawMessage.content.split(" ");
      var command = args[0];
      args.shift();
  
      switch (command) {
        case "$wynncraft":
          wynncraftController.command(args, (embed) => {
            rawMessage.channel.send(embed);
          });
          break;
        case "$hivemc":
          hivemcController.command(args, (embed) => {
            rawMessage.channel.send(embed);
          });
          break;
        case "$coinflip":
          coinflipController.command(args, (embed) => {
            rawMessage.channel.send(embed);
          });
          break;
        case "$lol":
          lolController.command(args, (embed) => {
            rawMessage.channel.send(embed);
          })
          break;
        default:
  
      }
    }
  });
  
  client.login(dtoken)
  
  mcping(process.env.SERVER_IP, process.env.SERVER_PORT, function(err, res) {
    if (err) {
      console.error(err);
    } else {
      //console.log(res);
      console.log(res.players.sample)
    }
  }, 3000);  
};

