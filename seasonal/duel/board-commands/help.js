const { DashboardCommand } = require('../classes/dashboard.message.js')
const gameconfig = require('../duel.config.js')

module.exports = new DashboardCommand('help', 'Help command',
    (msg, client, that) => {
        return msg.reply({
            embed: {
                title: 'Duel Help',
                description: 'Objective:',
                fields: [
                    { name: 'Win', value: "Reduce opponent's hero hp to 0", inline: false },
                    { name: 'How to', value: 'Battle 2 players with shared cards. Use reactions as buttons to active actions', inline: false }
                ]
            }
        }).then(m => setTimeout(m.delete, gameconfig.board.timeDeleteMessage))
    })