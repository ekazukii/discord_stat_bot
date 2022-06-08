require('dotenv').config();
require('../build/discord')({
  dicord_token: process.env.DISCORD_TOKEN,
  xbox_key: process.env.XBOX_API_KEY,
  riotapi: process.env.RIOT_API,
  hypixelapi: process.env.HYPIXEL_API,
  cocapi: process.env.COC_API,
  csgoapi: process.env.CSGO_API,
});
