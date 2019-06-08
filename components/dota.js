const { Component } = require('aghanim')
const { Request } = require('erisjs-utils')

module.exports = class Dota extends Component {
    constructor(client, options) {
        super(client)
        this.appID = 570
        this.gameInfoUrl = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${this.appID}`
    }
    gameInfo() {
        return Request.getJSON(this.gameInfoUrl).then(data => {
            return {
                currentplayers: data.response.player_count
            }
        })
    }
}