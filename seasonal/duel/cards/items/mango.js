const ItemCard = require('../item.card')

const manaIncrement = 2
module.exports = () => new ItemCard({
    gold : 2,
    manaIncrement,
    name: 'Mango',
    description: `Gets +${manaIncrement} <emoji_mana>`,
    run(sourcePlayer, targetPlayer, board) {
        const self = this
        sourcePlayer.addModifier({
            affect: ['player'], mana: manaIncrement,
            event: 'game_round_ends', expiration: 2,
            source: self.name,
            description: self.description
        })
        // sourcePlayer.createNotification(`gets +${manaIncrement} <emoji_mana>`)
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