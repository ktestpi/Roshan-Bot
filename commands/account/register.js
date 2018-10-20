const { Command } = require('aghanim')
const opendota = require('../../helpers/opendota')
const basic = require('../../helpers/basic')
const { Datee, Request } = require('erisjs-utils')

module.exports = new Command('register',{
  category : 'Account', help : 'Registro en el bot', args : '[dotaID] [steamID] [twitchID] [twitterID]'},
  function(msg, args, command){
    // let self = this
    const lang = this.locale.getUserStrings(msg)
    if(args.length < 2){
      msg.replyDM(this.locale.replacer(lang.registerHelp))
    }else{
      const server = this.config.guild;
      if(args[1].length < 1 ){return msg.addReaction(this.config.emojis.default.error)};
      let account = {dota : args[1] ? args[1] : '' ,steam : args[2] ? args[2] : '', twitch : args[3] ? args[3] : '', twitter : args[4] ? args[4] : ''};
      const guildName = msg.channel.guild ? msg.channel.guild.name : 'DM';
      const guildID = msg.channel.guild ? msg.channel.guild.id : msg.channel.id;
      let msgServer = {}, msgChannel, color;
      if(this.cache.profiles.get(msg.author.id)){return msg.reply(lang.errorProfileRegisteredAlready)}
      for(i in account){
        if(account[i] == '-' && i != 'dota'){account[i] = ''};
        account[i] = basic.parseProfileURL(account[i],i);
      }
      Request.getJSON('https://api.opendota.com/api/players/' + account.dota).then((result) => {
        if(!result.profile){return msg.reply(this.locale.replacer(lang.errorDotaIDNotValid,{id : account.dota}))};
        this.createMessage(server.accounts,{
          embed : {
            title : this.locale.replacer(lang.registerAccountTitle,{id : msg.author.id}),
            description : this.locale.replacer(lang.registerAccountDesc,{guildName, guildID, dotaID : account.dota, steamID : account.steam, twitchID : account.twitch, twitterID : account.twitter}),
            //thumbnail : {url : config.icon, height : 40, width : 40},
            footer : {text : msg.author.username + ' | ' + msg.author.id + ' | ' + Datee.custom(msg.timestamp,'D/M/Y h:m:s'),icon_url : msg.author.avatarURL},
            color: this.config.colors.account.register
          }
        }).then(m => {
          msg.addReaction(this.config.emojis.default.envelopeIncoming);
          const newAccount = basic.newAccount({profile : account})
          this.cache.profiles.save(msg.author.id,newAccount).then(() => {
            this.discordLog.controlMessage('accountnew',msg.author.username,'');
            msg.replyDM({
              embed : {
                title : this.locale.replacer(lang.welcomeToRoshan),
                //author : {name : config.bot.name, icon_url : config.bot.icon},
                description : this.locale.replacer(lang.infoAboutDotaForDiscord),
                fields : [{
                  name : lang.dataUrRegistry,
                  value : this.locale.replacer(lang.dataUrRegistryAccount,{dotaID : newAccount.profile.dota, steamID : newAccount.profile.steam, twitchID : newAccount.profile.twitch, twitterID: newAccount.profile.twitter}),
                  inline : false
                },{
                  name : lang.tyForUrRegistry,
                  value : this.locale.replacer(lang.helpRegistryDesc),
                  inline : false
                }],
                thumbnail : {url : msg.author.avatarURL, height : 40, width : 40},
                // footer : {text : lang.botCreated, icon_url : this.user.avatarURL},
                color: this.config.color
              }
            })
            m.addReaction(this.config.emojis.default.accept);
          })
        })
      })
    }
  })
