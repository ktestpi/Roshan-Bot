const { DashboardCommand } =  require('../classes/dashboard.message.js')

module.exports = new DashboardCommand('draw', 'Concede the game',
    (msg, client, that) => {
        const args = msg.content.split(' ')
        args.shift()
        const type = args.shift()
        const card = args.join(' ')
        that.hand.forceDraw(type, card)
    })