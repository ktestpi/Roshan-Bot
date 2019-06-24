module.exports = class UnitModifier{
    constructor(modifier){
        const stat = setStat(modifier)
        const stats = ['atk', 'rst', 'hp', 'bounty', 'mana']
        stats.forEach(s => this[s] = stat(s))
        this.affect = modifier.affect || []
        this.expiration = modifier.expiration || 'persist'
    }
}

const setStat = modifier => stat => modifier[stat] || 0
