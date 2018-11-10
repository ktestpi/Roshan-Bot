const CustomPlugin = require('../classes/custom-plugin.js')
const odutil = require('../helpers/opendota-utils')

module.exports = class Account extends CustomPlugin() {
    constructor(client, options) {
        super(client)
    }
    updateAccountLeaderboard(discordID, dotaID, data) {
        if (data) {
            const player = this.client.users.get(discordID)
            const rank = odutil.getMedal(data, 'raw')
            const update = {
                username: player.username || data.profile.personaname,
                nick: data.profile.personaname || '',
                avatar: player.avatarURL || data.profile.avatarmedium,
                rank: rank.rank,
                leaderboard: rank.leaderboard
            }
            return this.client.db.child(`leaderboard/${ranking}/${discordID}`).update(update)
        } else {
            this.client.od.account(dotaID).then(([data]) => this.updateAccountLeaderboard(discordID, dotaID, data))
        }
    }
}
