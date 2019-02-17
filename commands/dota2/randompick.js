const { Command } = require('aghanim')
const enumHeroes = require('../../enums/heroes')
// const util = require('erisjs-utils')

module.exports = new Command(['randompick','rp'],{
  category : 'Dota 2', help : 'Elige aleatoriamente un héroe', args : ''},
  async function(msg, args, client){
    let hero
    do {
      hero = enumHeroes.getValue(Math.floor(Math.random()*client.config.constants.heroes)).localized_name;
    } while (hero.length < 1);
    return msg.reply('randompick.message',{author : msg.author.username, hero})
  })
