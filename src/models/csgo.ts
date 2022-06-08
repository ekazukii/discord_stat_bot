import fetch from 'node-fetch';
import { ErrorResponse, CSGOStats } from '../types';

/** Model for Counter Strike : Global Offensive command */
export class CSGOModel {
  api_key: string;

  /**
   * save api_key
   * @param {string} api_key - Counter Strike : Global Offensive API key
   */
  constructor(api_key: string) {
    this.api_key = api_key;
  }

  /**
   * Fetch information about the user
   * @param {Object} options
   * @param {string} options.username - Faceit player's username
   * @param {function(Object)} callback  - Callback statistics to controller list of stats {@link CSGOView#showUserStats}
   */
  getUserStats(options: { username: string }, callback: Function) {
    var self = this;
    var username = options.username;
    var headers = {
      Authorization: 'Bearer ' + this.api_key,
    };

    fetch(`https://open.faceit.com/data/v4/players?nickname=${username}`, {
      headers: headers,
    })
      .then((res: any) => res.json())
      .then((body: any) => {
        if (typeof body.errors === 'undefined') {
          var id = body.player_id;
          fetch(`https://open.faceit.com/data/v4/players/${id}/stats/csgo`, {
            headers: headers,
          })
            .then((res: any) => res.json())
            .then((body2: any) => {
              if (typeof body2.errors === 'undefined') {
                var response = new CSGOStats();
                response.elo = body.games.csgo.faceit_elo;
                response.lvl = body.games.csgo.skill_level;
                response.hs = body2.lifetime['Average Headshots %'];
                response.win = body2.lifetime['Win Rate %'];
                response.kd = body2.lifetime['Average K/D Ratio'];
                callback(response);
              } else {
                var errRes = new ErrorResponse();
                errRes.error = true;
                errRes.error_desc = "User don't play csgo";
                callback(errRes);
              }
            });
        } else {
          var errRes = new ErrorResponse();
          errRes.error = true;
          errRes.error_desc = 'User not found';
          callback(errRes);
        }
      });
  }
}
