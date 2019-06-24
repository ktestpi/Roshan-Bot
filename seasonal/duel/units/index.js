const Unit = require('../core/unit.js')
const path = require('path')
const { jsFilesOnDirectory } = require('../duel.util.js')
const units = {}
const unitTypes = jsFilesOnDirectory(path.join(__dirname, './types'))

unitTypes.forEach(unitType => {
    units[path.basename(unitType,'.js')] = require(unitType)
})

module.exports = function createUnitType(unitType){
    return new Unit(units[unitType]())
}