const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
// const basic = require('../helpers/basic')
const lang = require('../lang.json')
// const util = require('erisjs-utils')

module.exports = new Command('randompick',{
  category : 'Dota 2', help : 'Elige aleatoriamente un héroe', args : ''},
  function(msg, args, command){
    // let self = this
    let hero
    do {
      hero = opendota.enum.heroNamebyID(Math.floor(Math.random()*120));
    } while (hero.length < 1);
    msg.reply(this.replace.do(lang.randomPick, {author : msg.author.username, hero : hero},true))
  })
