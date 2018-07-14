const SKILL = {
  "0" : "Any",
  "1" : "Normal",
  "2" : "High",
  "3" : "Very High"
}

module.exports = function(id){
  return SKILL[id] || ''
}

module.exports.skill = SKILL
