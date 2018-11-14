const { Command } = require('aghanim')
const { sortBy } = require('../../helpers/sort')
const enumHeroes = require('../../enums/heroes')

const _heroes = enumHeroes.toArray().filter(hero => hero.value.name).map(hero => hero.value)
  .sort(sortBy('alpha','a','name')).map(hero => `\`${hero.alias.join(',')}\``).join(' | ')
//

module.exports = new Command('cardheroes',{
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
