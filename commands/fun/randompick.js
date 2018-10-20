const { Command } = require('aghanim')
const enumHeroes = require('../../enums/heroes')
// const util = require('erisjs-utils')

module.exports = new Command(['randompick','rp'],{
  category : 'Dota 2', help : 'Elige aleatoriamente un héroe', args : ''},
  function(msg, args, command){
    let hero
    do {
      hero = enumHeroes.getValue(Math.floor(Math.random()*this.config.constants.heroes)).name;
    } while (hero.length < 1);
    return msg.reply(this.locale.replacer(this.locale.getUserString('randomPick',msg),{author : msg.author.username, hero : hero}))
  })
