const { ItemCard } = require('../../core/card')

const resistence = 1
const name = 'Mecanish'
const expiration = 3
const description = `Your hero and creeps gets **+${resistence}** resistence (Ex: ${expiration})`
module.exports = () => ItemCard({
    gold: 3,
    name: name,
    modifiers: [
        {
            affect: ['hero', 'creep'], rst: resistence,
            event: 'game_round_ends', expiration,
            source: name,
            description
        }
    ],
    description
})