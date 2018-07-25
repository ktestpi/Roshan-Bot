const { Command } = require('aghanim')
// const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
// const util = require('erisjs-utils')
const lang = require('../lang.json')
const enumHeroes = require('../helpers/enums/heroes')
// console.log(require('../helpers/enums/heroes'));
// console.log('ARRAY',heroesArray);
const _heroes = enumHeroes.toArray().filter(hero => hero.value.name).map(hero => hero.value)
  .sort(basic.sortBy('alpha','a','name')).map(hero => `\`${hero.alias.join(',')}\``).join(' | ')
//

module.exports = new Command('cardheroes',{
  category : 'Cuenta', help : 'Ayuda de las etiquetas de héroes', args : ''},
  function(msg, args, command){
    msg.replyDM({
      embed : {
        title: lang.cardHelpHeroesCmdTitle,
        description : lang.cardHelpHeroesCmdDesc.replaceKey({heroes : _heroes}),
        color : this.config.color
      }
    })
  })
