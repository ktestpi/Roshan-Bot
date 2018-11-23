const { SimpleEnums } = require('../classes/enums')
const { item_ids, items } = require('dotaconstants')

const Items = {}

Object.keys(items).forEach(k => {
    const item = items[k]
    item.name_id = k
    item.components = Array.isArray(item.components) ? item.components.map(component_id => {
        const { dname, cost } = items[component_id]
        return {dname , cost}
    }) : []
    Items[item.id] = item
})

const enumItems = new SimpleEnums(Items)

enumItems.getValueByName = function(tag){
    for (const [key, val] of this) {
        if(typeof val.dname !== 'string' || val.dname.toLowerCase().includes('recipe')){continue}
        if (val.dname.toLowerCase().includes(tag.toLowerCase())) { return val }
    }
    return undefined
}
enumItems.apiURL = 'https://api.opendota.com'
enumItems.dotaCdnURL = 'http://cdn.dota2.com'
enumItems.dotaWikiURL = 'http://dota2.gamepedia.com/'

module.exports = enumItems