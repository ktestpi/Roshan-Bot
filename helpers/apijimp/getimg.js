const iids = require('./items_id.json')
const hids = require('./heroes_id.json')

module.exports.getItem = function(id){
  const item = iids[id] || null
  return !item.includes('recipe') ? iids[id] : null
}

module.exports.getHero = function(id){
  return hids[id].name_id || null
}
