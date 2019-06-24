const { ItemCard } = require('../../core/card')

const manaIncrement = 3
const name = 'Mango'
const description = `Gets +${manaIncrement} <emoji_mana> next round`

module.exports = () => ItemCard({
    gold : 2,
    name,
    description,
    modifiers: [{
        affect: ['player'], mana: manaIncrement,
        event: 'game_round_ends', expiration: 2,
        source: name,
        description
    }]
})