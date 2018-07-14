const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const apijimp = require('../helpers/apijimp')
const { check } = require('../helpers/cmd')

module.exports = new Command('card',{
  category : 'Cuenta', help : 'Muestra tu tarjeta de jugador', args : '', cooldown : 60, autoCooldown : false, cooldownMessage : lang.warningInCooldown},
  function(msg, args, command){
    let self = this
    let user = msg.mentions.length ? msg.mentions[0] : msg.author
    const profile = this.cache.profiles.get(user.id)
    if(!profile){if(user.id === msg.author.id){basic.needRegister(msg,user.id)};return}
    // if(profile.card.heroes.split('').length < 1){return msg.reply(this.replace.do(lang.errorCardNoHeroes,{username : user.username, cmd : 'r!cardhelp'},true))}
    msg.channel.sendTyping();
    if(profile.card.heroes.split('').length < 1){
      opendota.request('card_heroes',profile.profile.dota).then(results => {
        profile.card.heroes = results[1].slice(0,3).map(h => h.hero_id).join(',')
        profile.card.pos = 'all'
        // profile.card.request = false
        apijimp.card([results[0],profile.card]).then(buffer => {
          msg.reply(this.replace.do(lang.playerCardCanConfig,{username : user.username},true),{file : buffer, name : user.username + '_roshan_card.png'})
          command.setCooldown(msg.author.id)
        }).catch(err => {
          console.log(err);
        })
      })
    }else{
      opendota.request('card',profile.profile.dota).then(results => {
        // if(results[0].error){return}
        apijimp.card([...results,profile.card]).then(buffer => {
          msg.reply(this.replace.do(lang.playerCard,{username : user.username},true),{file : buffer, name : user.username + '_roshan_card.png'})
          command.setCooldown(msg.author.id)
        }).catch(err => {
          console.log(err);
        })

      })
    }
  })
