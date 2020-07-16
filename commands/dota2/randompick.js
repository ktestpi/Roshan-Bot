const enumHeroes = require('../../enums/heroes')

module.exports = {
  name: ['randompick','rp'],
  category : 'Dota 2',
  help : 'Elige aleatoriamente un héroe',
  args : '',
  run: async function (msg, args, client, command, command){
    let hero
    do {
      const heroRandom = Math.floor(Math.random()*client.config.constants.heroes)
      hero = enumHeroes.getValue(heroRandom)
    } while (!hero || hero.name.length < 1);
    return msg.reply('randompick.message',{hero: hero.localized_name})
  }
}
