const { ItemCard } = require('../../core/card')

const name = 'Blessing'
const hitpoints = 2
const description = `Your hero and creeps get **+${hitpoints}** hp`
module.exports = () => ItemCard({
    gold: 6,
    name: name,
    description,
    skill: {
        name: name,
        passive: true,
        description,
        cooldown: 0,
        refresh: 0,
        modifier: {
            affect: ['hero', 'creep'], hp: hitpoints,
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