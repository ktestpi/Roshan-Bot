const { SimpleEnums } = require('../classes/enums')

const POSITIONS = {
  "1" : "Carry",
  "2" : "Mid",
  "3" : "Offlaner",
  "4" : "Support",
  "5" : "hardSupport",
  "core" : "Core",
  "sup" : "Support",
  "all" : "All positions",
  "roamer" : "Roamer",
  "carry" : "Carry",
  "mid" : "Mid",
  "off" : "Offlaner",
  "hsup" : "Hard Support",
  "carry-es" : "Portador",
  "sup-es" : "Apoyo",
  "mid-es" : "Medio"
}

module.exports = new SimpleEnums(POSITIONS)
