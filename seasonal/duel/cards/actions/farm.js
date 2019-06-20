const ActionCard = require('../action.card')
const CreepUnit = require('../../units/types/creep.unit')

const gold = 2
module.exports = () => new ActionCard({
    name: 'Farm',
    description: `Gets +${gold} <emoji_gold>`,
    mana: 0,
    gold: 2,
    run(sourcePlayer, targetPlayer, board) {
        sourcePlayer.incrementGold(this.gold)
    }
})