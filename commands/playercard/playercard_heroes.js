const { Command } = require('aghanim')
const { sortBy } = require('../../helpers/sort')
const enumHeroes = require('../../enums/heroes')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'playercard.helpheroes.title',
  description: 'playercard.helpheroes.description'
})

const _heroes = enumHeroes.toArray().filter(hero => hero.value.name).map(hero => hero.value)
  .sort(sortBy('alpha','a','name')).map(hero => `\`${hero.alias.join(',')}\``).join(' | ')
//

module.exports = new Command('heroes',{
  subcommandFrom : 'playercard',
  category : 'Account', help : 'Ayuda de las etiquetas de héroes', args : ''},
  async function (msg, args, client, command){
    return msg.replyDM(embed, {
      heroes: _heroes
    })
  })
