const { DashboardCommand } = require('../classes/dashboard.message.js')


module.exports = new DashboardCommand('log', 'Help command',
    (msg, client, that) => {
        console.log(that.players)
    })