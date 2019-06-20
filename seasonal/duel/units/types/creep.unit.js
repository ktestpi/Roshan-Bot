const BasicUnit = require('./basic.unit')

module.exports = class CreepUnit extends BasicUnit {
    constructor(owner) {
        super({ type: 'creep', expiration: 'persist', bounty: 1, name: 'Creep', atk : 2, rst : 0, hp : 4 }, owner)
    }
    attack(targetUnit) {
        targetUnit.hp = this.atk - targetUnit.rst
    }
}