const { SimpleEnums } = require('../classes/enums')

const card_bg = {
  '0' : 'roshan',
  '1' : 'mheroes',
  '2' : 'dotalogo',
  '3' : 'io',
  '4' : 'pa',
  '5' : 'phoenix',
  '6' : 'qop',
  '7' : 'axe-unleashed',
  '8' : 'earthshaker-planetfall',
  '9' : 'invoker-young',
  '10' : 'tiny-collossus'
}

module.exports = new SimpleEnums(card_bg)
