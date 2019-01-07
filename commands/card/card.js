const { Command } = require('aghanim')
const apijimp = require('../../helpers/apijimp')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')

module.exports = new Command('id+',{
  category : 'Account', help : 'Muestra tu tarjeta de jugador', args : '', cooldown : 10,
  cooldownMessage : function(msg,args,command,cooldown){return this.locale.getUserString('warningInCooldown',msg)}},
  function(msg, args, command){
    const user = msg.mentions.length ? msg.mentions[0] : msg.author
    return this.components.Account.exists(msg.author.id)
      // .then(player => Promise.all([player,this.components.Opendota.player(player.data.profile.dota)]))
      .then(account => {
        // if (!account.discordID) { throw new UserError('opendota', 'errorOpendotaRequest', err)}
        const lang = this.locale.getUserStrings(msg)
        // if(profile.card.heroes.split('').length < 1){return msg.reply(this.replace.do(lang.errorCardNoHeroes,{username : user.username, cmd : 'r!cardhelp'},true))}
        msg.channel.sendTyping();
        if(account.card.heroes.split('').length < 1){
          return this.components.Opendota.card_heroes(account.dota).catch(err => { throw new UserError('opendota', 'errorOpendotaRequest', err ) }).then(results => {
            account.card.heroes = results[1].slice(0,3).map(h => h.hero_id).join(',')
            account.card.pos = 'all'
            return apijimp.card([results[0],account.card])})
          .then(buffer => this.createMessage(this.config.guild.generated,'',{file : buffer, name : user.username + '_roshan_card.png'}))
          .then(m => msg.reply({embed : {
              // description : `${this.locale.replacer(lang.playerCard,{username : user.username})}\n${basic.socialLinks(account.profile,'vertical',this.config.links.profile)}`,
              image : { url : m.attachments[0].url},
              color : this.config.color}
            }))
          // .then(buffer => msg.reply(lang.playerCardCanConfig.replaceKey({username : user.username}),{file : buffer, name : user.username + '_roshan_card.png'}))
          .catch(err => {
            throw new UserError('opendota', 'errorOpendotaRequest', null, err)
            return command.error()
          })
        }else{
          return this.components.Opendota.card(account.dota).catch(err => {console.log(err);throw new UserError('opendota', 'errorOpendotaRequest', err ) })
            .then(results => apijimp.card([...results,account.card]))
            // .then(buffer => msg.reply({
            //     embed : {description : `${this.replace.do(lang.playerCard,{username : user.username},true)}\n${basic.socialLinks(profile.profile,'inline',this.config.links.profile)}`, color : this.config.color}
            //   },
            //   {file : buffer, name : user.username + '_roshan_card.png'}))
            .then(buffer => this.createMessage(this.config.guild.generated,'',{file : buffer, name : user.username + '_roshan_card.png'}))
            .then(m => msg.reply({embed : {
                description : `${this.locale.replacer(lang.playerCard,{username : user.username})}\n${this.components.Account.socialLinks(account)}`,
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
