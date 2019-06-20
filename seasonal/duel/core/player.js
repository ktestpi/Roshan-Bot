const HeroUnit = require('../units/types/hero.unit')
const gameconfig = require('../duel.config.js')
const CreepUnit = require('../units/types/creep.unit')
class Player {
    constructor(player, board) {
        const { id, name, avatar, rank, color, playerIndex} = player
        this.id = id
        this.playerIndex = playerIndex
        this.name = name
        this.avatar = avatar
        this.rank = rank
        this.color = color
        this.units = []
        this.modifiers = []
        this._mana = gameconfig.board.player.mana
        this._gold = gameconfig.board.player.gold
        this.hero = new HeroUnit({ name: this.name, atk: gameconfig.board.player.atk, rst: gameconfig.board.player.rst, hp: gameconfig.board.player.hp}, this)
        this.createUnit(this.hero)
        this.createUnit(new CreepUnit(this))
        this.board = board
        const self = this
        this.skill = {
            can(sourcePlayer, opponetPlayer, board){
                self.createNotification(`${self.name} hasn't a skill`)
                return false
            },
            run(sourcePlayer, opponetPlayer, board){

            }
        }
    }
    get enemy(){
        return this.board.players.find(player => player.playerIndex === (this.playerIndex === 1 ? 0 : 1))
    }
    emit(event, ...args){
        this.board.emit(event, ...args, this)
    }
    createNotification(message, file){
        const content = `**${this.name}** ${message}`
        this.board.addHistoryAction({description: content})
        return Promise.resolve()
    }
    get atk(){
        return this.units.reduce((sum, unit) => sum + unit.atk, 0)
    }
    get rst() {
        return this.units.reduce((sum, unit) => sum + unit.rst, 0)
    }
    get hp() {
        return this.hero.hp
    }
    get mana(){
        return this.board.round + this._mana
            + this.modifiers.filter(modifier => modifier.affect && modifier.affect.includes('player') && modifier.mana).reduce((sum, modifier) => sum + modifier.mana,0)
            + this.units.map(unit => unit.modifiers).filter(modifier => modifier.affect && modifier.affect.includes('player') && modifier.mana).reduce((sum, modifier) => sum + modifier.mana, 0)
    }
    get gold() {
        return this._gold
            + this.modifiers.filter(modifier => modifier.affect && modifier.affect.includes('player') && modifier.gold).reduce((sum, modifier) => sum + modifier.gold, 0)
            + this.units.map(unit => unit.modifiers).filter(modifier => modifier.affect && modifier.affect.includes('player') && modifier.gold).reduce((sum, modifier) => sum + modifier.gold, 0)
    }
    consumeMana(value){
        this._mana -= value
    }
    incrementMana(value) {
        this._mana += value
    }
    consumeGold(value) {
        this._gold -= value
    }
    incrementGold(value) {
        this._gold += value
    }
    addModifier(modifier){
        this.board.addHistoryAction({ type: 'player_modifiers_adds', description: `**${this.name}**: modifier added (${modifier.source}) - ${modifier.description}` })
        this.modifiers.push(modifier)
    }
    removeModifier(modifier) {
        this.board.addHistoryAction({ type: 'player_modifiers_removes', description: `**${this.name}**: modifier removed (${modifier.source}) - ${modifier.description}`})
        this.modifiers = this.modifiers.filter(m => m !== modifier)
    }
    attack(targetPlayer){
        const damage = this.attacking(targetPlayer)
        targetPlayer.hero._hp -= damage
        this.board.addHistoryAction({ type: 'player_attacks', description: `**${targetPlayer.name}**: receives **${damage}** damage by attack` })
    }
    attacking(targetPlayer){
        return this.atk - targetPlayer.hero._rst
    }
    checkLetal(targetPlayer){
        return this.hero.hp <= targetPlayer.atk - this.hero.rst
    }
    passiveGold(){
        this._gold++
    }
    get passTurn(){
        const self = this
        return {
            getInitiative: true,
            can(){
                return true
            },
            run(){
                self.board.addHistoryAction({ type: 'pass', description: `**${self.name}** pass`, source: self })
            }
        }
    }
    createUnit(unit){
        this.units.push(unit)
    }
    removeUnit(unit) {
        this.units = this.units.filter(u => u !== unit)
    }
    // unitsAtk(){
    //     return this.units.length > 1 ? Math.round(this.units.reduce((sum, unit) => {
    //         if (!unit.isHero) { sum += unit.atk } 
    //     }, 0) / (this.units.length - 1)) : 0
    // }
    render(){
        return { name: `${this.name}: ${this.mana} <emoji_mana> ${this.gold} <emoji_gold> ${this.atk}/${this.rst}/${this.hp} ${this.checkLetal(this.enemy) ? '<emoji_skull>' : ''}`, value: this.units.map(unit => unit.render()).join('\n'), inline: true}
    }
}

module.exports = Player