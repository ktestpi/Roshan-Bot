const gameconfig = require('../duel.config.js')
const createUnitType = require('../units')
const PlayerSkill = require('./player-skill.js')

/** @class */
/** @alias DuelPlayer */
class Player {
    /** @param {{id: string, name: string, avatar: string, rank: number, color: number}} player - Player */
    /** @param {Board} board */
    /** @prop {number} id - Player ID */
    /** @prop {string} name - Player name */
    /** @prop {string} avatar - Player avatar */
    /** @prop {number} color - Player color */
    /** @prop {array} units - Player ID */
    /** @prop {arrays} array - Player ID */
    /** @prop {atk} atk - Player Atk */
    /** @prop {rst} rst - Player Rst */
    /** @prop {hp} hp - Player hp */
    /** @prop {Player} enemy - Enemy player */
    /** @prop {} hero - Enemy player */
    /** @prop {Board} board - Enemy player */
    /** @prop {} skill - Player skill */
    /** @prop {number} playerIndex */
    /** @prop {Board} board */
    constructor(player, board) {
        const { id, name, avatar, rank, color, mention} = player
        this.id = id
        this.name = name
        this.avatar = avatar
        this.rank = rank
        this.color = color
        this.mention = mention
        this.units = []
        this.modifiers = []
        this._hp = gameconfig.board.player.hp
        this._mana = gameconfig.board.player.mana
        this._gold = gameconfig.board.player.gold
        this.hero = createUnitType('hero')
        this.hero.name = this.name
        this.addUnit(this.hero)
        this.board = board
        this.skill = new PlayerSkill({
            requirements(sourcePlayer, opponetPlayer, board){
                sourcePlayer.createNotification("hasn't a skill")
                return false
            },
            run(sourcePlayer, opponetPlayer, board){

            },
            name: 'None',
            description: ''
        }, this)
    }
    start(){
        // this.addUnit(createUnitType('mage'))
        this.addUnit(createUnitType('warleader'))
    }
    get enemy(){
        return this.board.players.find(player => player.playerIndex === (this.playerIndex === 1 ? 0 : 1))
    }
    emit(event, ...args){
        this.board.emit(event, ...args, this)
    }
    /**
     * 
     * @param {*} message - Message 
     * @param {*} file - File
     */
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
        return this._hp + this.modifiers.filter(modifier => modifier.affect && modifier.affect.includes('player') && modifier.hp).reduce((sum, modifier) => sum + modifier.hp, 0)
            + this.units.map(unit => unit.modifiers).filter(modifier => modifier.affect && modifier.affect.includes('player') && modifier.hp).reduce((sum, modifier) => sum + modifier.hp, 0)
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
    consumeHp(value) {
        this._hp -= value
    }
    addHp(value) {
        this._hp += value
    }
    consumeMana(value) {
        this._mana -= value
    }
    addMana(value) {
        this._mana += value
    }
    consumeGold(value) {
        this._gold -= value
    }
    addGold(value) {
        this._gold += value
    }
    /**
     * Heal to player
     * @param {number} value - Value to heal
     * @param {{name: string}} source - Source
     */
    healed(value, source){
        this.addHp(value)
        this.createNotification(`healed **${value}** hp by **${source.name}**`)
    }
    /**
     * Damaged with perforation by
     * @param {number} value - Value to be damaged
     * @param {{name: string}} source - Source
     */
    damagedPerforation(value, source) {
        this.consumeHp(value)
        this.createNotification(`perforated **${value}** hp by **${source.name}**`)
    }
    /**
     * Damaged by
     * @param {number} value - Value to be damaged
     * @param {{name: string}} source - Source
     */
    damaged(value, source) {
        value = value - this.rst
        this.consumeHp(value)
        this.createNotification(`damaged **${value}** hp by **${source.name}**`)
    }
    destroyedMana(value, source){
        this.consumeMana(value)
        this.createNotification(`destroyed **${value}** <emoji_mana> by **${source.name}**`)
    }
    producedMana(value, source){
        this.addMana(value)
        this.createNotification(`produced **${value}** <emoji_mana> by **${source.name}**`)
    }
    destroyedGold(value, source) {
        this.consumeGold(value)
        this.createNotification(`destroyed **${value}** <emoji_gold> by **${source.name}**`)
    }
    producedGold(value, source) {
        this.addGold(value)
        this.createNotification(`produced **${value}** <emoji_gold> by **${source.name}**`)
    }
    addModifier(modifier){
        this.modifiers.push(modifier)
        this.createNotification(`modifier added **${modifier.source}** - ${modifier.description}`)
    }
    removeModifier(modifier) {
        this.modifiers = this.modifiers.filter(m => m !== modifier)
        this.createNotification(`modifier removed **${modifier.source}** - ${modifier.description}`)
    }
    attack(targetPlayer){
        targetPlayer.damaged(this.atk, this)
    }
    attacking(targetPlayer){
        return this.atk - targetPlayer.hero._rst
    }
    checkLetal(targetPlayer){
        return this.hp <= targetPlayer.atk - this.rst
    }
    passiveGold(){
        this._gold++
    }
    get passTurn(){
        const self = this
        return {
            getInitiative: true,
            canPlay(){
                return true
            },
            play(){
                self.board.addHistoryAction({ type: 'pass', description: `**${self.name}** pass`, source: self })
            }
        }
    }
    get isSilenced(){
        return this.modifiers.some(modifier => modifier.silence)
    }
    addUnit(unit){
        unit.setOwner(this)
        this.units.push(unit)
        unit.onAddPlayer(this)
    }
    removeUnit(unit) {
        if(unit === this.hero){
            const expiration = 2
            this.addModifier({event: 'game_round_starts', source: unit.name, description: `Revive hero ${unit.name} with hp base. When round ${this.board.round + expiration} starts`, expiration: expiration,
            run: (board) => {

            },
            onExpire: () => {
                this.hero.revive()
                this.units = [this.hero, ...this.units]
            }})
        }
        this.units = this.units.filter(u => u !== unit)
        unit.onRemovePlayer(this)
    }
    render(){
        return { name: `${this.name}: ${this.mana} <emoji_mana> ${this.gold} <emoji_gold> ${this.atk}/${this.rst}/${this.hp} ${this.checkLetal(this.enemy) ? '<emoji_skull>' : ''}${this.isSilenced ? ' <emoji_silence>' : ''}`, value: this.units.map(unit => unit.render()).join('\n') || 'No army', inline: true}
    }
    acquireSkill(skill){
        this.skill.onDestroy(this)
        this.skill = new PlayerSkill(skill, this)
        this.createNotification(`acquired **${this.skill.name}**`)
        this.skill.onAcquire(this)
    }
    info(){
        const self = this
        return {
            embed: {
                title: 'Player: ' + self.name,
                fields: [
                    self.render(),
                    { name: 'Modifiers', value: this.modifiers.map(modifier => `Affect: ${modifier.affect.join(', ')} - **${modifier.source}** - ${modifier.description}`).join('\n') || 'No modifiers', inline: false }
                ],
                color: self.color
            }
        }
    }
    emit(event){
        this.modifiers.filter(modifier => modifier.event && modifier.event === event)
            .forEach(modifier => {
                if (modifier.run) {
                    modifier.run(modifier.ctx)
                }
                if (typeof modifier.expiration === 'number') {
                    modifier.expiration--
                    if (modifier.expiration <= 0) {
                        if (modifier.onExpire) {
                            modifier.onExpire()
                        }
                        this.removeModifier(modifier)
                    }
                }
            })
        this.units.forEach(unit => {
            unit.modifiers.filter(modifier => modifier.event && modifier.event === event)
                .forEach(modifier => {
                    if (modifier.run) {
                        modifier.run()
                    }
                    if (typeof modifier.expiration === 'number') {
                        modifier.expiration--
                        if (modifier.expiration <= 0) {
                            if (modifier.onExpire) {
                                modifier.onExpire()
                            }
                            unit.removeModifier(modifier)
                        }
                    }
                })
        })
    }
}

module.exports = Player