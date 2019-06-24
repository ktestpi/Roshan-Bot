const createUnitType = require('../units')
class Card{
    /**
     * @constructor
     * @param {{type: string}} config Param configuration
     */
    constructor(config){
        this.type = config.type
        this.name = config.name
        this.description = config.description
        if (config.can) { this.can = config.can }
        if (config.run) { this.run = config.run }
        Object.keys(config).forEach(key => {
            this[key] = config[key]
        })
    }
    requirements(sourcePlayer, targetPlayer, board) {
        return true
    }
    canPlay(sourcePlayer, targetPlayer, board) {
        let mana = true, gold = true
        if(this.mana){
            mana = this.canMana(sourcePlayer, targetPlayer, board)
        }
        if(this.gold){
            gold = this.canGold(sourcePlayer, targetPlayer, board)
        }
        return mana && gold && this.requirements(sourcePlayer, targetPlayer, board)
    }
    run(sourcePlayer, targetPlayer, board){
        // board.addActionToHistory()
    }
    canMana(sourcePlayer, targetPlayer, board) {
        const can = sourcePlayer.mana >= this.mana
        if (!can) {
            sourcePlayer.createNotification('not enough mana')
        }
        return can
    }
    canGold(sourcePlayer, targetPlayer, board) {
        const can = sourcePlayer.gold >= this.gold
        if (!can) {
            sourcePlayer.createNotification('not enough gold')
        }
        return can
    }
    play(sourcePlayer, targetPlayer, board){
        play(sourcePlayer, this)
        play(targetPlayer, this.enemy)
        this.run(sourcePlayer, targetPlayer, board)
    }
    render(button) {
        return `${button} **${this.name}**${this.mana > 0 ? `: ${this.mana} <emoji_mana> ` : ''}${this.gold > 0 ? ` ${this.gold} <emoji_gold>` : ''} - ${this.description}`
    }
}

function play(player, card = {}){
    if (card.skill) {
        player.acquireSkill(card.skill)
    }
    if (card.mana) {
        player.consumeMana(card.mana)
    }
    if (card.gold) {
        player.consumeGold(card.gold)
    }
    if (card.modifiers) {
        card.modifiers.forEach(modifier => player.addModifier(modifier))
    }
    if (card.events) {
        card.events.forEach(modifier => player.addEvent(modifier))
    }
    if (card.invoke) {
        card.invoke.forEach(unit => {
            const invokation = createUnitType(unit)
            player.addUnit(invokation)
        })
    }
}

const createTypeCard = type => options => {
    options.type = type
    return new Card(options)
}

module.exports = Card
module.exports.ActionCard = createTypeCard('action')
module.exports.ItemCard = createTypeCard('item')