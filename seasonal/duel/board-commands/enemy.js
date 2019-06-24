const { DashboardCommand } = require('../classes/dashboard.message.js')
const { deleteMessageAfterTime} = require('../duel.util.js')

module.exports = new DashboardCommand('enemy', 'Concede the game',
    (msg, client, that) => {
        const player = that.players.find(player => player.id === msg.author.id)
        if (player && player.enemy) {
            return msg.reply(that.replaceContent(player.enemy.info()))
                .then(deleteMessageAfterTime(5000))
        }
    })