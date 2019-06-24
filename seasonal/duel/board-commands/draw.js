const { DashboardCommand } =  require('../classes/dashboard.message.js')

module.exports = new DashboardCommand('draw', 'Concede the game',
    (msg, client, that) => {
        const args = msg.content.split(' ')
        args.pop()
        const type = args.pop()
        const card = args.join(' ')
        that.hand.forceDraw(type, card)
    })