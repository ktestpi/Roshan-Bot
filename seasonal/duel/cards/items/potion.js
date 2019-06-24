const { ItemCard } = require('../../core/card')

const healing = 4
module.exports = () => ItemCard({
    gold : 2,
    name: 'Potion',
    description: `Hero gets +${healing} HP`,
    run(sourcePlayer, targetPlayer, board) {
        sourcePlayer.healed(healing, this.name)
    }
})