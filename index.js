const discord = require("./build/discord");
require("dotenv").config();

discord({
  dicord_token: process.env.DISCORD_TOKEN,
  riotapi: process.env.RIOT_API,
  cocapi: process.env.COC_API,
  csgoapi: process.env.CSGO_API,
});
