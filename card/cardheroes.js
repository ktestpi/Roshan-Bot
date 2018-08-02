const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const lang = require('../lang.json')
const enumHeroes = require('../helpers/enums/heroes')

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
