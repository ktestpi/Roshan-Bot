const { DashboardCommand } =  require('../classes/dashboard.message.js')
const { deleteMessageAfterTime} = require('../duel.util.js')

module.exports = new DashboardCommand('commands', 'See commands avaliables',
    (msg, client, that) => msg.reply({embed : {
        title: 'Commands',
        description: that.commands.sort((a,b) => a.name > b.name).map(command => `${command.name} - ${command.description}`).join('\n')
    }}).then(deleteMessageAfterTime(20000)))