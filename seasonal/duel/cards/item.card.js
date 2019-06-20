const Card = require('./card')

module.exports = class ItemCard extends Card{
    constructor(config) {
        config.type = 'item'
        super(config)
        this.gold = config.gold || 0
    }
    render(button) {
        return `${button} **${this.name}**${this.gold > 0 ? `: ${this.gold} <emoji_gold> ` : ' '}- ${this.description}`
    }
    can(sourcePlayer, targetPlayer, board){
        return this.canGold(sourcePlayer, targetPlayer, board)
    }
    canGold(sourcePlayer, targetPlayer, board){
        const can = sourcePlayer.gold >= this.gold
        if (can) {
            sourcePlayer.consumeGold(this.gold)
        } else {
            sourcePlayer.createNotification('not enough gold')
        }
        return can
    }
}