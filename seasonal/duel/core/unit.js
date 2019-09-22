module.exports = class BasicUnit{
    constructor(stats = {}, owner){
        this.type = stats.type || 'creep'
        this.name = stats.name || 'Unknown'
        this._expiration = stats.expiration || 'persist'
        this._atk = stats.atk || 0
        this._rst = stats.rst || 0
        this._hp = stats.hp || 0
        this._hp_base = this._hp
        this._bounty = stats.bounty || 0
        this.modifiers = stats.modifiers || []
        this.owner = owner
        this.alive = true
        if (stats.onAddPlayer){ this.onAddPlayer = stats.onAddPlayer}
        if (stats.onRemovePlayer) { this.onRemovePlayer = stats.onRemovePlayer }
    }
    get isHero(){
        return this.type === 'hero'
    }
    get isIllusion() {
        return this.type === 'illusion'
    }
    get isCreep() {
        return this.type === 'creep'
    }
    get isDisarmed(){
        return this.modifiers.some(modifier => modifier.disarm) || this.owner.modifiers.some(modifier => modifier.disarm)
    }
    addModifier(modifier){
        this.modifiers.push(modifier)
    }
    stat(s){
        if(s === 'atk' && this.isDisarmed){ return 0 }
        // if(s === 'rst' && this.isDisarmed){ return 0 }
        return this['_' + s] + this.statBonus(s)
    }
    statBonus(s){
        return this.modifiers.filter(modifier => modifier.affect && modifier.affect.includes('self') && modifier[s]).reduce((sum, modifier) => {
            sum += modifier[s] || 0
            return sum
        }, 0) + this.owner.modifiers.filter(modifier => modifier.affect && modifier.affect.includes(this.type) && modifier[s]).reduce((sum, modifier) => {
            sum += modifier[s] || 0
            return sum
        }, 0)
    }
    get atk(){
        return this.stat('atk')
    }
    get rst() {
        return this.stat('rst')
    }
    get hp() {
        return this.stat('hp')
    }
    set hp(value){
        this._hp += value
    }
    get bounty() {
        return this.stat('bounty')
    }
    get expiration() {
        return typeof this._expiration === 'number' ? this.stat('_expiration') : this._expiration
    }
    render(){
        return `${this.name} (${this.type}) ${this.atk}/${this.rst}/${this.hp}${this.isDisarmed ? ' <emoji_disarm>' : ''}`
    }
    healing(value){
        this._hp += value
    }
    upgradeRst(value) {
        this._rst += value
    }
    reduceCooldown(turns = -1){
        if(typeof expiration === 'number'){
            this._expiration += turns
        }
    }
    varHp(value){
        this._hp += value
    }
    varAtk(value) {
        this._atk += value
    }
    varRst(value) {
        this._rst += value
    }
    varBounty(value) {
        this._bounty += value
    }
    damaged(damage){
        this.varHp(-(damage - this.rst))
    }
    damagedPerforation(damage){
        this.varHp(-damage)
    }
    setOwner(player){
        this.owner = player
        return this
    }
    setHp(value){
        this._hp = value
    }
    revive(){
        this._hp = this._hp_base
    }
    onAddPlayer(player){
    }
    onRemovePlayer(player) {
    }
    addModifier(modifier){
        this.modifiers.push(modifier)
    }
    removeModifier(modifier) {
        this.modifiers = this.modifiers.filter(m => m !== modifier)
    }
}