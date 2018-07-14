const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('register',{
  category : 'Cuenta', help : 'Registro en el bot', args : '[dotaID] [steamID] [twitchID] [twitterID]'},
  function(msg, args, command){
    let self = this
    if(args.length < 2){
      msg.author.getDMChannel().then(channel => channel.createMessage(this.replace.do('registerHelp')))
    }else{
      const server = this.config.guild;
      if(args[1].length < 1 ){return msg.addReaction(self.config.emojis.default.error)};
      let account = {dota : args[1] ? args[1] : '' ,steam : args[2] ? args[2] : '', twitch : args[3] ? args[3] : '', twitter : args[4] ? args[4] : ''};
      const guildName = msg.channel.guild ? msg.channel.guild.name : 'DM';
      const guildID = msg.channel.guild ? msg.channel.guild.id : msg.channel.id;
      let msgServer = {}, msgChannel, color;
      if(self.cache.profiles.get(msg.author.id)){return} //TODO ya registrado
      for(i in account){
        if(account[i] == '-' && i != 'dota'){account[i] = ''};
        account[i] = basic.parseProfileURL(account[i],i);
      }
      util.request.getJSON('https://api.opendota.com/api/players/' + account.dota).then((result) => {
        if(!result.profile){return msg.addReaction(self.config.emojis.default.error)};
        this.createMessage(server.accounts,{
          embed : {
            title : 'Registro de cuenta' + ' - ' + msg.author.id,
            description : self.replace.do(`**Guild/DM:** \`${guildName}\` **ID:** \`${guildID}
            \`\n<dota> <dotaID>\n<steam> <steamID>\n<twitch> <twitchID>\n<twitter> <twitterID>`,{dotaID : account.dota, steamID : account.steam, twitchID : account.twitch, twitterID : account.twitter},true),
            //thumbnail : {url : config.icon, height : 40, width : 40},
            footer : {text : msg.author.username + ' | ' + msg.author.id + ' | ' + util.date(msg.timestamp,'log'),icon_url : msg.author.avatarURL},
            color: self.config.colors.account.register
          }
        }).then(m => {
          msg.addReaction(self.config.emojis.default.envelopeIncoming);
          this.logger.add('accountnew',msg.author.username,true);
          msg.author.getDMChannel().then(channel => {
            // TODO: add profile to cache
            // config._.profiles.add(msg.author.id,update[msg.author.id].profile);
            const newAccount = basic.newAccount({profile : account})
            this.cache.profiles.save(msg.author.id,newAccount).then(() => {
              channel.createMessage({
                embed : {
                  title : self.replace.do('¡Bienvenido a Roshan <roshan>'),
                  //author : {name : config.bot.name, icon_url : config.bot.icon},
                  description : self.replace.do('Información sobre <dota> **Dota 2 para Discord**!') || "",
                  fields : [{
                    name : 'Datos de tu registro',
                    value : self.replace.do('<dota> <dotaID>\n<steam> <steamID>\n<twitch> <twitchID>\n<twitter> <twitterID>\n',{dotaID : newAccount.profile.dota, steamID : newAccount.profile.steam, twitchID : newAccount.profile.twitch, twitterID: newAccount.profile.twitter},true),
                    inline : false
                  },{
                    name : '¡Muchas gracias por tu registro :grin: !',
                    value : self.replace.do(':regional_indicator_h: :regional_indicator_e: :regional_indicator_l: :regional_indicator_p: Usa `r!help` para ver los comandos disponibles.\n\n:information_source: ¡Puedes usar la mayoría de comandos por mensaje directo a **<bot_name>**!'),
                    inline : false
                  }],
                  thumbnail : {url : msg.author.avatarURL, height : 40, width : 40},
                  footer : {text : self.replace.do(lang.botCreated),icon_url : self.user.avatarURL},
                  color: self.config.color
                }
              })
              m.addReaction(self.config.emojis.default.accept);
            })
          })
        })
      })
    }
  })
