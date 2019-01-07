const { Command } = require('aghanim')
const {Datee , Request} = require('erisjs-utils')

module.exports = new Command('account',{
  category : 'Account', help : 'Muestra/modifica tu cuenta', args : '[dotaID] [steamID] [twithID] [twitterID]'},
  function(msg, args, command){
    // let self = this
    return this.components.Account.exists(msg.author.id)
      .then(account => {
        if(!account){return command.error()}
        const lang = this.locale.getUserStrings(msg)
        return msg.replyDM({
          embed: {
            title: lang.urRoshanAccount, //lang.urRoshanAccount
            description: this.locale.replacer(lang.dataRoshanAccount, { dotaID: account.dota, steamID: account.steam, lang: this.locale.getUserFlag(account.lang) }),//this.replace.do('dataRoshanAccount',{dotaID : profile.profile.dota, steamID : profile.profile.steam, twitchID : profile.profile.twitch, twitterID : profile.profile.twitter},true),
            thumbnail: { url: msg.author.avatarURL, height: 40, width: 40 },
            // footer : {text : this.locale.replace('botCreated',msg),icon_url : this.user.avatarURL},
            color: this.config.color
          }
        })
      })
  })
