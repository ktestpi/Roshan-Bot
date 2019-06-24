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
    const results = []
    for (const [key, val] of this) {
        if (typeof val.dname !== 'string') { continue }
        if (val.dname.toLowerCase().includes(tag.toLowerCase())) { results.push(val) }
    }
    if (results.length) {
        const exact = results.find(result => result.dname.toLowerCase() === tag.toLowerCase())
        return exact ? exact : results[0]
    } else {
        return undefined
    }
}

enumAbilities.apiURL = 'https://api.opendota.com'
enumAbilities.dotaCdnURL = 'http://cdn.dota2.com'
enumAbilities.dotaWikiURL = 'http://dota2.gamepedia.com/'

module.exports = enumAbilities