const { DashboardCommand } =  require('../classes/dashboard.message.js')

module.exports = new DashboardCommand('concede', 'Concede the game',
    (msg, client, that) => {
        const player = that.players.find(player => player.id === msg.author.id)
        if (player) {
            that.close(player.enemy)
        }

    })