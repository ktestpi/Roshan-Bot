module.exports = class BasicUnit{
    constructor(stats, owner){
        this.type = stats.type
        this.name = stats.name
        this._expiration = stats.expiration
        this._atk = stats.atk
        this._rst = stats.rst
        this._hp = stats.hp
        this._bounty = stats.bounty
        this.modifiers = stats.modifiers || []
        this.owner = owner
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
    addModifier(modifier){
        this.modifiers.push(modifier)
    }
    stat(s){
        return this['_' + s] + this.statBonus(s)
    }
    statBonus(s){
        return this.modifiers.filter(modifier => modifier.affect.includes(this.type) && modifier[s]).reduce((sum, modifier) => {
            sum += modifier[s] || 0
            return sum
        }, 0) + this.owner.modifiers.filter(modifier => modifier.affect.includes(this.type) && modifier[s]).reduce((sum, modifier) => {
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
        return `${this.name} (${this.type}) ${this.atk}/${this.rst}/${this.hp}`
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
}