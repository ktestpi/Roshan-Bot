const { ItemCard } = require('../../core/card')

const healing = 8
module.exports = () => ItemCard({
    gold : 3,
    name: 'Super Potion',
    description: `Player healed ${healing} HP`,
    run(sourcePlayer, targetPlayer, board) {
        sourcePlayer.healed(healing, this.name)
    }
})