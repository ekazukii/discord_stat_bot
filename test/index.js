require('dotenv').config();
//require("../discord.js")({dicord_token: process.env.DISCORD_TOKEN, xbox_key: process.env.XBOX_API_KEY, riotapi: process.env.RIOT_API});
var dtoken = process.env.DISCORD_TOKEN;
var xboxkey = process.env.XBOX_API_KEY;
var riotapi = process.env.RIOT_API;

const Discord = require('discord.js');
const client = new Discord.Client();
const LoLController = require("../controller/lol.js");
const assert = require('assert').strict;
const request = require("request");

var lolController;

describe("Discord tests", function() {
    
    before(function(done){
        client.on('ready', () => {
            client.user.setStatus('visible');
            lolController = new LoLController(client, riotapi);
            done();
        });
      });


    describe("League of Legends UT", function() {
        it("Should get user id", function(done) {
            lolController.model.getSummonerByName("ekazukii", (summ) => {
                if(summ.accountId === "NvlC0gZvkw-VWWOgTbritH3kig_HayvUdGivE_Nv2iXwK0XR_ucoqWtz") done()
            });
        });

        it("Should get current champion rotation", function(done) {
            lolController.model.getChampionRotation((champList) => {
                if(champList.length === 15) done();
            })
        })
    });
});


client.login(dtoken)
