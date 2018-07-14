const POSITIONS = {
  "1" : "Carry",
  "2" : "Mid",
  "3" : "Offlaner",
  "4" : "Support",
  "5" : "hardSupport",
  "core" : "Principal",
  "sup" : "Support",
  "all" : "Todas las posiciones",
  "roamer" : "Roamer",
  "carry" : "Carry",
  "off" : "Offlaner",
  "hsup" : "HardSupport"
}

module.exports = function(id){
  return POSITIONS[id] || null
}

module.exports.array = Object.keys(POSITIONS).map(k => ({_id : k, name : POSITIONS[k]}))
module.exports.positions = POSITIONS
