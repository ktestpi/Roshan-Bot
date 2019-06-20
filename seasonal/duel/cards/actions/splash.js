const ActionCard = require('../action.card')

module.exports = () => new ActionCard({
    name: 'Splash',
    description: 'Splash 4 damage to an enemy unit',
    damage: 4,
    mana: 0,
    can(sourcePlayer, targetPlayer, board){
        if (this.canMana(sourcePlayer, targetPlayer, board)){
            const unit = targetPlayer.units.find((unit, index) => index > 0)
            if(!unit){
                sourcePlayer.createNotification(`enemy hasn't units`)
                return false
            }else{
                return true
            }
        }
    },
    run(sourcePlayer, targetPlayer, board) {
        const unit = targetPlayer.units.find((unit, index) => index > 0)
        unit._hp -= this.damage
    }
})