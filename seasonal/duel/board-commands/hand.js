const { DashboardCommand } = require('../classes/dashboard.message.js')

module.exports = new DashboardCommand('hand', 'Help command',
    (msg, client, that) => {
        console.log('HAND', that.hand.actions, that.hand.items)
    })