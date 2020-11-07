const request = require('request');

/** Model for Clash of Clans command */
class CSGOModel {

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
        var username = options.username;
        var auth = {
            'bearer': this.api_key
        }

        request(`https://open.faceit.com/data/v4/players?nickname=${username}`, {json: true, auth: auth}, (err, res, body) => {
            if(err) throw err;
            if(typeof body.errors === "undefined") {
                var id = body.player_id;
                request(`https://open.faceit.com/data/v4/players/${id}/stats/csgo`, {json: true, auth: auth}, (err, res, body2) => {
                    if(typeof body2.errors === "undefined") {
                        response.elo = body.games.csgo.faceit_elo;
                        response.lvl = body.games.csgo.skill_level;
                        response.hs = body2.lifetime["Average Headshots %"];
                        response.win = body2.lifetime["Win Rate %"];
                        response.kd = body2.lifetime["Average K/D Ratio"];
                        callback(response);
                    } else {
                        response.error = true;
                        response.error_desc = "User don't play csgo";
                        callback(response);
                    }
                })
            } else {
                response.error = true;
                response.error_desc = "User not found";
                callback(response);
            }
        });
    }
}

module.exports = CSGOModel;
