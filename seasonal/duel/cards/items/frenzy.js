const { ItemCard } = require('../../core/card')

const name = 'Frenzy'
const attack = 4
const resistence = -1
const description = `Your hero and creeps get **+${attack}** attack and reduce their resistence **-${resistence}**`
module.exports = () => ItemCard({
    gold: 10,
    name: name,
    description,
    skill: {
        name: name,
        passive: true,
        description,
        cooldown: 0,
        refresh: 0,
        modifier: {
            affect: ['hero', 'creep'], atk: attack, rst: resistence,
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