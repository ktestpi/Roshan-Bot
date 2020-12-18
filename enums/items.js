const { SimpleEnums } = require('../classes/enums')
const { item_ids, items } = require('dotaconstants')

const Items = {}

Object.keys(items).forEach(k => {
    const item = items[k]
    item.name_id = k
    item.components = Array.isArray(item.components) && item.components.length ? item.components.filter(component_id => component_id).map(component_id => {
        const { dname, cost } = items[component_id.replace('*', '')]
        return {dname , cost}
    }) : []
    Items[item.id] = item
})

const enumItems = new SimpleEnums(Items)

enumItems.getValueByName = function(tag){
    const results = []
    for (const [key, val] of this) {
        if(typeof val.dname !== 'string' || val.dname.toLowerCase().includes('recipe')){continue}
        if (val.dname.toLowerCase().includes(tag.toLowerCase())) { results.push(val) }
    }
    if (results.length){
        const exact = results.find(result => result.dname.toLowerCase() === tag.toLowerCase())
        return exact ? exact : results[0]
    }else{
        return undefined
    }
}
enumItems.apiURL = 'https://api.opendota.com'
enumItems.dotaCdnURL = 'http://cdn.dota2.com'
enumItems.dotaWikiURL = 'http://dota2.gamepedia.com/'

module.exports = enumItems