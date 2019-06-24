module.exports = () => ({
    type: 'creep',
    name: 'War Leader',
    atk: 2,
    rst: 0,
    hp: 2,
    expiration: 'persist',
    bounty: 1,
    onAddPlayer(owner){
        this.modifier = {
            affect: ['creep', 'hero'],
            description: 'All player units gets +1/0/+1',
            atk: 1,
            hp: 1,
            source: this.name
        }
        owner.addModifier(this.modifier)      
    },
    onRemovePlayer(owner){
        owner.removeModifier(this.modifier)
    }
})