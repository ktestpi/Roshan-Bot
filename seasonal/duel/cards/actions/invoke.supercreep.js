const { ActionCard }= require('../../core/card')

module.exports = () => ActionCard({
    name: 'SuperCreep',
    description: 'Invoke 1 Super Creep 3/0/4',
    mana : 5,
    invoke: ['supercreep'],
    run(sourcePlayer, targetPlayer, board) {
        
    }
})