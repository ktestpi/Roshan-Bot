const enumHeroes = require('../../enums/heroes')

module.exports = {
  name: ['randompick','rp'],
  category : 'Dota 2',
  help : 'Elige aleatoriamente un héroe',
  args : '',
  run: async function (msg, args, client, command, command){
    let hero
    do {
      hero = enumHeroes.getValue(Math.floor(Math.random()*client.config.constants.heroes)).localized_name;
    } while (hero.length < 1);
    return msg.reply('randompick.message',{hero})
  }
}
