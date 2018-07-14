const ENUM = {
  "0" : 'roshan'
}

module.exports = function(id){
  return ENUM[id] || null
}

module.exports.enum = ENUM
