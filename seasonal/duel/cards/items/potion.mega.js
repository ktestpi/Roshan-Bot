const { ItemCard } = require('../../core/card')

const healing = 16
module.exports = () => ItemCard({
    gold : 5,
    name: 'Mega Potion',
    description: `Player healed ${healing} HP`,
    run(sourcePlayer, targetPlayer, board) {
        sourcePlayer.healed(healing, this.name)
    }
})