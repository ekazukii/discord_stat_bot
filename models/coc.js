const request = require('request');

/** Model for Clash of Clans command */
class CoCModel {

    /**
     * save api_key
     * @param {string} api_key - Clash of Clans API key
     */
    constructor(api_key) {
        this.api_key = api_key;
    }


    /**
     * Fetch information about the user
     * @param {Object} options
     * @param {string} options.tag - Clash of Clans player's tag
     * @param {function(Object)} callback  - Callback statistics to controller list of stats {@link CoCView#showUserStats}
     */
    getUserStats(options, callback) {
        var response = {}
        var self = this;
        var tag = options.tag;
        var uriTag = tag.replace("#", "%23");
        var auth = {
            'bearer': this.api_key
        }

        request(`https://api.clashofclans.com/v1/players/${uriTag}`, {json: true, auth: auth}, (err, res, body) => {
            if(err) throw err;
            console.log(body);
            if(body.reason !== "notFound") {
                response.name = body.name
                response.townHallLevel = body.townHallLevel;
                response.trophies = body.trophies;
                response.clan = {
                    name: body.clan.name,
                    tag: body.clan.tag,
                    stars: body.warStars
                }
                response.level = body.expLevel;
                response.heroes = body.heroes;
                callback(response);
            } else {
                response.error = true;
                response.error_desc = "user not found";
                callback(response);
            }
        });
    }
}

module.exports = CoCModel;
