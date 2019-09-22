const { ItemCard } = require('../../core/card')

const damage = 6
const name = 'Dagon'
const refresh = 2
module.exports = () => ItemCard({
    gold: 6,
    name: name,
    damage: damage,
    description: `Gets <emoji_skill>: Do ${damage} damage to enemy (CD: ${refresh})`,
    skill: {
        requirements: function (sourcePlayer, targetPlayer, board) {
            if (this.cooldown <= 0) {
                return true
            } else {
                sourcePlayer.createNotification(`<emoji_skill> ${this.name} is on cooldown (${this.cooldown})`)
                return false
            }
        },
        run: function (sourcePlayer, targetPlayer, board) {
            targetPlayer.damaged(this.damage, { name: `${sourcePlayer.name}'s ${this.name}` })
        },
        name: name,
        description: `Do **${damage}** damage to enemy`,
        cooldown: 0,
        refresh: refresh,
        damage: damage
    }
})