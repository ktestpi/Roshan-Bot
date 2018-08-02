const { Command } = require('aghanim')
const lang = require('../lang.json')
const enumHeroes = require('../helpers/enums/heroes')
// const util = require('erisjs-utils')

module.exports = new Command(['randompick','rp'],{
  category : 'Dota 2', help : 'Elige aleatoriamente un héroe', args : ''},
  function(msg, args, command){
    let hero
    do {
      hero = enumHeroes.getValue(Math.floor(Math.random()*this.config.constants.heroes)).name;
    } while (hero.length < 1);
    msg.reply(this.replace.do(lang.randomPick, {author : msg.author.username, hero : hero},true))
  })
