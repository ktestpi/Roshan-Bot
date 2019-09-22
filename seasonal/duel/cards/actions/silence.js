const { ActionCard } = require('../../core/card')

module.exports = () => ActionCard({
    name: 'Silence',
    description: 'Silence enemies',
    mana: 0,
    run(sourcePlayer, targetPlayer, board) {
        targetPlayer.addModifier({source:'Silence', description: 'Silenced', silence: true,  event: 'game_round_ends', expiration: 1})
    }
})