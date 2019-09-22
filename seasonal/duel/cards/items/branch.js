const { ItemCard } = require('../../core/card')

const name = 'Branch'
const attack = 1
const resistence = 1
const hitpoints = 1
const description = `Your hero gets **+${resistence}** `
module.exports = () => ItemCard({
    gold: 2,
    name: name,
    description,
    skill: {
        name: name,
        passive: true,
        description,
        cooldown: 0,
        refresh: 0,
        modifier: {
            affect: ['hero'], rst: resistence, atk: attack, hp: hitpoints,
            source: name,
            description
        },
        onAcquire(player){
            player.addModifier(this.modifier)
        },
        onDestroy(player){
            player.removeModifier(this.modifier)
        }
    }
})