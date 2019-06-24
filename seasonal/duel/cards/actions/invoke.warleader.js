const { ActionCard } = require('../../core/card')

module.exports = () => ActionCard({
    name: 'War Leader',
    description: 'Invoke 1 War Leader 2/0/2',
    mana : 4,
    invoke: ['warleader'],
    run(sourcePlayer, targetPlayer, board) {
        
    }
})