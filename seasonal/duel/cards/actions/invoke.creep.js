const { ActionCard }= require('../../core/card')

module.exports = () => ActionCard({
    name: 'Creep',
    description: 'Invoke 1 Creep 1/0/2',
    mana : 2,
    invoke: ['creep'],
    run(sourcePlayer, targetPlayer, board) {
        
    }
})