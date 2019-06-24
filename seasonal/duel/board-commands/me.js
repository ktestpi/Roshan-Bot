const { DashboardCommand } = require('../classes/dashboard.message.js')
const { deleteMessageAfterTime} = require('../duel.util.js')

module.exports = new DashboardCommand('me', 'Concede the game',
    (msg, client, that) => {
        const player = that.players.find(player => player.id === msg.author.id)
        if (player) {
            return msg.reply(that.replaceContent(player.info()))
                .then(deleteMessageAfterTime(5000))
        }
    })