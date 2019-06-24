const { ActionCard } = require('../../core/card')

const goldBonus = 3

module.exports = () => ActionCard({
    name: 'Farm',
    description: `Gets +${goldBonus} <emoji_gold>`,
    mana: 0,
    run(sourcePlayer, targetPlayer, board) {
        sourcePlayer.producedGold(goldBonus, this)
    }
})