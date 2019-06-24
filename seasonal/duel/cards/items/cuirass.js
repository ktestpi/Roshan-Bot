const { ItemCard } = require('../../core/card')

const name = 'Cuirass'
const resistence = 1
const description = `Your hero and creeps gets **+${resistence}** resistence`
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
            affect: ['hero', 'creep'], rst: 1,
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