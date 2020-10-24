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
        it("Should get user statistics", function(done) {
            lolController.model.getUserStats({username: "ekazukii"}, (stats) => {
                if(typeof stats.match !== "undefined") {
                    done();
                }
            });
        });

        it("Should get current champion rotation", function(done) {
            lolController.model.getChampionRotation((champList) => {
                if(champList.length === 15) done();
            });
        });

        it("Should compare ekazukii and ObstinateM", function(done) {
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            lolController.model.comparePlayers({user1: "ekazukii", user2: "ObstinateM"}, (stats) => {
                if(stats.score1.reduce(reducer) > 20 && stats.score2.reduce(reducer) > 20) {
                    done();
                }
            });
        });

        it("Should get user creep score over last 5 games", function(done) {
            lolController.model.getUserCS({username: "ekazukii", ngame: 5}, (stats) => {
                if(stats.cs.length === 5) {
                    done();
                }
            });
        });

        
    });
});


client.login(dtoken)
