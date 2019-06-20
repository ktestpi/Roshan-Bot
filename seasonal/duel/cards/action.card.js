const Card = require('./card')

module.exports = class ActionCard extends Card{
    constructor(config) {
        config.type = 'action'
        super(config)
        this.mana = config.mana || 0
        if(config.can){this.can = config.can}
    }
    render(button){
        return `${button} **${this.name}**${this.mana > 0 ? `: ${this.mana} <emoji_mana> ` : ' '}- ${this.description}`
    }
    can(sourcePlayer, targetPlayer, board){
        return this.canMana(sourcePlayer, targetPlayer, board)
    }
    canMana(sourcePlayer, targetPlayer, board){
        console.log('PlayerMana', this.mana)
        const can = sourcePlayer.mana >= this.mana
        if (can) {
            sourcePlayer.consumeMana(this.mana)
        } else {
            sourcePlayer.createNotification('not enough mana')
        }
        return can
    }
}