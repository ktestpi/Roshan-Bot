const { Command } = require('aghanim')
const opendota = require('../../helpers/opendota')
const basic = require('../../helpers/basic')
const {Datee , Request} = require('erisjs-utils')

module.exports = new Command('account',{
  category : 'Account', help : 'Muestra/modifica tu cuenta', args : '[dotaID] [steamID] [twithID] [twitterID]'},
  function(msg, args, command){
    // let self = this
    const profile = this.cache.profiles.get(msg.author.id)
    console.log(profile)
    if (!profile) { return basic.needRegister(msg)}
    const lang = this.locale.getUserStrings(msg)
    if(args.length < 2){
      msg.replyDM({
        embed : {
          title : lang.urRoshanAccount, //lang.urRoshanAccount
          description : this.locale.replacer(lang.dataRoshanAccount,{dotaID : profile.profile.dota, steamID : profile.profile.steam, twitchID : profile.profile.twitch, twitterID : profile.profile.twitter, lang : this.locale.getUserFlag(profile.lang)}),//this.replace.do('dataRoshanAccount',{dotaID : profile.profile.dota, steamID : profile.profile.steam, twitchID : profile.profile.twitch, twitterID : profile.profile.twitter},true),
          thumbnail : {url : msg.author.avatarURL, height : 40, width : 40},
          // footer : {text : this.locale.replace('botCreated',msg),icon_url : this.user.avatarURL},
          color: this.config.color
        }
      })
    }else{
      const server = this.config.guild;
      let account = {dota : args[1] || '' ,steam : args[2] || '', twitch : args[3] || '', twitter : args[4] || ''};
      const guildName = msg.channel.guild ? msg.channel.guild.name : 'DM';
      const guildID = msg.channel.guild ? msg.channel.guild.id : msg.channel.id;
      let msgServer = {}, msgChannel, color;
      for(i in account){
        if(account[i] == '-' || account[i] === ''){account[i] = profile.profile[i]}
        else{account[i] = basic.parseProfileURL(account[i],i)}
      }
      if(account.dota){
        Request.getJSON('https://api.opendota.com/api/players/' + account.dota).then(result => {
          if(!result.profile){msg.addReaction(this.config.emojis.default.error);return}; //TODO need register
          this.logger.add('accountmodify',msg.author.username,true);
          this.createMessage(server.accounts,{
            embed : {
              title : 'Modificar cuenta' + ' - ' + msg.author.id,
              //TODO REMOVER this.replace.do
              description : this.locale.replacer(`**Guild/DM:** \`${guildName}\` **ID:** \`${guildID}
              \`\n<dota> <dotaID>\n<steam> <steamID>\n<twitch> <twitchID>\n<twitter> <twitterID>`,{dotaID: account.dota, steamID : account.steam, twitchID : account.twitch, twitterID : account.twitter}),
              //thumbnail : {url : config.icon, height : 40, width : 40},
              footer : {text : msg.author.username + ' | ' + msg.author.id + ' | ' + Datee.custom(msg.timestamp,'D/M/Y h:m:s') ,icon_url : msg.author.avatarURL},
              color: this.config.colors.account.modify}
          }).then(m => {
              msg.addReaction(this.config.emojis.default.envelopeIncoming)
              this.cache.profiles.modify(msg.author.id,{profile : account}).then(() => {
                msg.replyDM({
                  embed : {
                    title : lang.dataUpdate,
                    //author : {name : config.bot.name, icon_url : config.bot.icon},
                    description : lang.tyForUpdateAccount,
                    fields : [{
                      name : lang.newData,
                      value : this.locale.replacer('<dota> <dotaID>\n<steam> <steamID>\n<twitch> <twitchID>\n<twitter> <twitterID>\n',{dotaID : account.dota, steamID : account.steam, twitchID : account.twitch, twitterID : account.twitter}),
                      inline : false
                    }],
                    thumbnail : {url : msg.author.avatarURL, height : 40, width : 40},
                    // footer : {text : lang.botCreated ,icon_url : this.user.avatarURL},
                    color: this.config.color
                  }
                })
              })
          })
        })
      }
    }
  })
