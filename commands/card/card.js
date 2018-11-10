const { Command } = require('aghanim')
const basic = require('../../helpers/basic')
const apijimp = require('../../helpers/apijimp')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')

module.exports = new Command('idcard',{
  category : 'Account', help : 'Muestra tu tarjeta de jugador', args : '', cooldown : 10,
  cooldownMessage : function(msg,args,command,cooldown){return this.locale.getUserString('warningInCooldown',msg)}},
  function(msg, args, command){
    const user = msg.mentions.length ? msg.mentions[0] : msg.author
    return this.plugins.Opendota.userID(msg, args)
      // .then(player => Promise.all([player,this.plugins.Opendota.player(player.data.profile.dota)]))
      .then(player => {
        if (!player.discordID) { throw new UserError('opendota', 'errorOpendotaRequest', err)}
        const lang = this.locale.getUserStrings(msg)
        const profile = player.data
        // if(profile.card.heroes.split('').length < 1){return msg.reply(this.replace.do(lang.errorCardNoHeroes,{username : user.username, cmd : 'r!cardhelp'},true))}
        msg.channel.sendTyping();
        if(profile.card.heroes.split('').length < 1){
          return this.plugins.Opendota.card_heroes(profile.profile.dota).catch(err => { throw new UserError('opendota', 'errorOpendotaRequest', err ) }).then(results => {
            profile.card.heroes = results[1].slice(0,3).map(h => h.hero_id).join(',')
            profile.card.pos = 'all'
            return apijimp.card([results[0],profile.card])})
          .then(buffer => this.createMessage(this.config.guild.generated,'',{file : buffer, name : user.username + '_roshan_card.png'}))
          .then(m => msg.reply({embed : {
              description : `${this.locale.replacer(lang.playerCard,{username : user.username})}\n${basic.socialLinks(profile.profile,'vertical',this.config.links.profile)}`,
              image : { url : m.attachments[0].url},
              color : this.config.color}
            }))
          // .then(buffer => msg.reply(lang.playerCardCanConfig.replaceKey({username : user.username}),{file : buffer, name : user.username + '_roshan_card.png'}))
          .catch(err => {
            throw new UserError('opendota', 'errorOpendotaRequest', null, err)
            return command.error()
          })
        }else{
          return this.plugins.Opendota.card(profile.profile.dota).catch(err => {console.log(err);throw new UserError('opendota', 'errorOpendotaRequest', err ) })
            .then(results => apijimp.card([...results,profile.card]))
            // .then(buffer => msg.reply({
            //     embed : {description : `${this.replace.do(lang.playerCard,{username : user.username},true)}\n${basic.socialLinks(profile.profile,'inline',this.config.links.profile)}`, color : this.config.color}
            //   },
            //   {file : buffer, name : user.username + '_roshan_card.png'}))
            .then(buffer => this.createMessage(this.config.guild.generated,'',{file : buffer, name : user.username + '_roshan_card.png'}))
            .then(m => msg.reply({embed : {
                description : `${this.locale.replacer(lang.playerCard,{username : user.username})}\n${basic.socialLinks(profile.profile,'vertical',this.config.links.profile)}`,
                image : { url : m.attachments[0].url},
                color : this.config.color}
              }))
            .catch(err => {
              throw new UserError('opendota', 'errorOpendotaRequest', err)
              return command.error()
            })
        }
    })
  })
