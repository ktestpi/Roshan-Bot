const BasicUnit = require('./basic.unit')

module.exports = class HeroUnit extends BasicUnit{
    constructor(stats, owner){
        const { name, atk, rst, hp } = stats
        super({ type: 'hero', expiration: 'persist', bounty: 5, name, atk, rst , hp}, owner)
    }
    attack(targetUnit){
        targetUnit.hp = this.atk - targetUnit.rst
    }
}