const ActionCard = require('../action.card')
const CreepUnit = require('../../units/types/creep.unit')

module.exports = () => new ActionCard({
    name: 'Create creep',
    description: 'Create 1 creep',
    mana : 2,
    run(sourcePlayer, targetPlayer, board) {
        console.log('creating creep')
        const creep = new CreepUnit(sourcePlayer)
        sourcePlayer.createUnit(creep)
    }
})