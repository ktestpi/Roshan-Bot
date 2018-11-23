const { SimpleEnums } = require('../classes/enums')
const { abilities } = require('dotaconstants')

const Abilities = {}

Object.keys(abilities).forEach(k => {
    const ability = abilities[k]
    ability.name_id = k
    Abilities[k] = ability
})

const enumAbilities = new SimpleEnums(Abilities)

enumAbilities.getValueByName = function(tag){
    for (const [key, val] of this) {
        if (typeof val.dname !== 'string') { continue }
        console.log('Skill',val.dname)
        if (val.dname.toLowerCase().includes(tag.toLowerCase())) { return val }
    }
    return undefined
}

enumAbilities.apiURL = 'https://api.opendota.com'
enumAbilities.dotaCdnURL = 'http://cdn.dota2.com'
enumAbilities.dotaWikiURL = 'http://dota2.gamepedia.com/'

module.exports = enumAbilities