## Code contribution

First of all if you want to add an feature, or fix a bug open an issue. There is maybe a reason of why this bug isn't fixed yet or maybe some people are already working on the same feature as you so before you spend any time on something that could be done differently or not done at all, open a GitHub issue.

Please before fork the bot look at the [fork-project wiki page](https://github.com/ekazukii/discord_stat_bot/wiki/fork-project) which explains how to get the API keys needed and how to perform unit test during development phase 

### Adding a new game

For adding a new game to the bot please ensure there is an existing **official** API for the game do not use html (or any type of) scraper or unofficial API.

The code structure follow a [MVC Structure](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller). So you will need to create at least three file. For example if I want to add the CSGO game i will create models/csgo.js, views/csgo.js and controller/csgo.js (You can check the hivemc files it's simple and well documented).

- Controller - The controller class need to have a command(args, lang, callback) method, "args" will be the commands arguments after the prefix for example with the command "$lol profile ekazukii" the arguments will be ["profile", "ekazukii"]. "lang" is the language of the bot in the server where the command has be triggered. And "callback" is a function that you will need to call with the [Embed object](https://ekazukii.github.io/discord_stat_bot/global.html#Embed) as param, wich will be displayed to the user.

- Model - The model class is the class where all the web/database request will be triggered there are no methods requirements but please use a descriptive method name. If you don't know how to perform http request you can check the models/hivemc.js file.

- View - The view class is where the [Embed object](https://ekazukii.github.io/discord_stat_bot/global.html#Embed) is created this class need to extends views/view.js class. For create the embed you must use [getEmbed()](https://ekazukii.github.io/discord_stat_bot/View.html#getEmbed) and for an error embed you muse use [getEmbedError()](https://ekazukii.github.io/discord_stat_bot/View.html#getEmbedError). They will provide you a preconfigured [Discord Message Object](https://ekazukii.github.io/discord_stat_bot/global.html#DiscordMessage) you have just to change the "message.embed.title" and "message.embed.fields" properties.

Avoid as much as possible to modify the discord.js file even if you will probably edit for adding the new controller or the new api keys be careful to not break any features.

You are encouraged to add unit tests with mocha by modifying the test/index.js file but this is not mandatory.

Once all changes have been made you just have to perform a pull request and wait for someone to review the changes.

### Adding or Edit a new command of an existing game

If you want to make changes on an existing game you will probably only edit the files of this game so you'll have to make sure that the unit tests for this game are always checked.

## Translation contribution

Translation files are located in the /views/lang/ directory you can copy the en_EN file and just edit with your language, please avoid as much as possible to use things like google translate.