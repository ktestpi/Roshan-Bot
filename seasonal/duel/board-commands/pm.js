const { DashboardCommand } = require('../classes/dashboard.message.js')

module.exports = new DashboardCommand('pm', 'Help command',
    (msg, client, that) => {
        console.log(that.players.map(player => player.modifiers))
    })