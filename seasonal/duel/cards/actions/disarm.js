const { ActionCard } = require('../../core/card')

module.exports = () => ActionCard({
    name: 'Disarm',
    description: 'Disarm all enemies',
    mana: 0,
    run(sourcePlayer, targetPlayer, board) {
        targetPlayer.units.forEach(unit => unit.addModifier({source:'Disarm', description: 'Disarm unit', disarm: true,  event: 'game_round_ends', expiration: 1}))
    }
})