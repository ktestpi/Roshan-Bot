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
        requirements: function (s, t, b) {
            if (this.cooldown <= 0) {
                return true
            } else {
                s.createNotification(`<emoji_skill> ${this.name} is on cooldown (${this.cooldown})`)
                return false
            }
        },
        run: function (s, t, b) {
            t.damaged(this.damage, { name: `${s.name}'s ${this.name}` })
        },
        name: name,
        description: `Do **${damage}** damage to enemy`,
        cooldown: 0,
        refresh: refresh,
        damage: damage
    }
})