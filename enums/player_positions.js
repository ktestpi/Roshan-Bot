const { SimpleEnums } = require('../classes/enums')

const POSITIONS = {
  "1" : "Carry",
  "2" : "Mid",
  "3" : "Offlaner",
  "4" : "Support",
  "5" : "hardSupport",
  "core" : "Core",
  "sup" : "Support",
  "all" : "Todas las posiciones",
  "roamer" : "Roamer",
  "carry" : "Carry",
  "off" : "Offlaner",
  "hsup" : "Hard Support",
  "por" : "Portador",
  "apo" : "Apoyo",
  "med" : "Medio"
}

module.exports = new SimpleEnums(POSITIONS)
