const { Command } = require('aghanim')
const basic = require('../../helpers/basic')
const enumHeroes = require('../../enums/heroes')

const _heroes = enumHeroes.toArray().filter(hero => hero.value.name).map(hero => hero.value)
  .sort(basic.sortBy('alpha','a','name')).map(hero => `\`${hero.alias.join(',')}\``).join(' | ')
//

module.exports = new Command('idcardheroes',{
  category : 'Account', help : 'Ayuda de las etiquetas de héroes', args : ''},
  function(msg, args, command){
    const lang = this.locale.getUserStrings(msg)
    return msg.replyDM({
      embed : {
        title: lang.cardHelpHeroesCmdTitle,
        description : this.locale.replacer(lang.cardHelpHeroesCmdDesc,{heroes : _heroes}),
        color : this.config.color
      }
    })
  })
