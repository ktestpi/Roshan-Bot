module.exports = () => ({
    type: 'creep',
    name: 'Mage',
    atk: 2,
    rst: 0,
    hp: 2,
    expiration: 'persist',
    bounty: 1,
    modifiers: [{affect: ['player'], mana: 2, description: 'Mage aura **+2** <emoji_mana>'}],
    onAddPlayer: function(owner){
        // owner.addModifier({affect: ['player'], mana: 2, source: this.name, description: `Aura: **+2** <emoji_mana>`})
    }
})