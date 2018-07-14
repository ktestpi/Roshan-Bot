const { Command } = require('aghanim')
// const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
// const util = require('erisjs-utils')
const lang = require('../lang.json')
const {heroesArray} = require('../helpers/enums/heroes')
// console.log(require('../helpers/enums/heroes'));
// console.log('ARRAY',heroesArray);
const _heroes = heroesArray.filter(hero => hero.name).sort(basic.sortBy('alpha','a','name')).map(hero => {
  return  `\`${hero.alias.join(',')}\``
}).join(' | ')
//

module.exports = new Command('cardheroes',{
  category : 'Cuenta', help : 'Ayuda de las etiquetas de héroes', args : ''},
  function(msg, args, command){
    let self = this
    msg.replyDM({
      embed : {
        title: 'Card - Ayuda héroes',
        description : `Comando: \`r!cardconfig <argumentos>\`\nPrefijo: \`.\`\n\n${_heroes}`,
        color : this.config.color
      }
    })
  })
