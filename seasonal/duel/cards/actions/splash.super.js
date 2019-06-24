const { ActionCard } = require('../../core/card')

const damage = 4
module.exports = () => ActionCard({
    name: 'Splash Super',
    description: `Do **${damage}** damage to all enemy units`,
    mana: 4,
    run(sourcePlayer, targetPlayer, board) {
        targetPlayer.units.forEach(unit => unit.damaged(damage))
    }
})