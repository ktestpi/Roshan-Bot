const { DashboardCommand } =  require('../classes/dashboard.message.js')

module.exports = new DashboardCommand('concede', 'Concede the game',
    (msg, client, that) => {
        const player = that.players.find(player => player.id === msg.author.id)
        if (player) {
            msg.reply(`${player.mention} conceded the game. Lobby will be destroyed in 15 seconds...`)
            that.conceded = true
            that.close(player.enemy)
        }
    })