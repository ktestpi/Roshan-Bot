const { Command } = require('aghanim')
const { sortBy } = require('../../helpers/sort')
const enumHeroes = require('../../enums/heroes')

const _heroes = enumHeroes.toArray().filter(hero => hero.value.name).map(hero => hero.value)
  .sort(sortBy('alpha','a','name')).map(hero => `\`${hero.alias.join(',')}\``).join(' | ')
//

module.exports = new Command('heroes',{
  subcommandFrom : 'playercard',
  category : 'Account', help : 'Ayuda de las etiquetas de héroes', args : ''},
  async function (msg, args, client, command){
    return msg.replyDM({
      embed: {
        title: 'playercard.helpheroes.title',
        description: 'playercard.helpheroes.description'
      }
    }, {
      heroes: _heroes
    })
  })
