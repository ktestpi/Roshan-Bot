const ItemCard = require('../item.card')

const healing = 4
module.exports = () => new ItemCard({
    gold : 2,
    healing,
    name: 'Salve potion',
    description: `Hero gets +${healing} HP`,
    run(sourcePlayer, targetPlayer, board) {
        sourcePlayer.hero.healing(this.healing)
        // sourcePlayer.addEffect(new StackEffect({
        //     expiration: 'persist',
        //     event: 'event_test',
        //     run(event) {
        //         console.log(event)
        //     }
        // }))
        // sourcePlayer.emit('player_create_unit', creep)
    }
})