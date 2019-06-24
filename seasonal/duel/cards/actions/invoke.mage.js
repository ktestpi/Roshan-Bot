const { ActionCard }= require('../../core/card')

module.exports = () => ActionCard({
    name: 'Mage',
    description: 'Invoke 1 Mage 2/0/2',
    mana : 3,
    invoke: ['mage'],
    run(sourcePlayer, targetPlayer, board) {
        
    }
})