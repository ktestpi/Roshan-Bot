const { Command } = require('aghanim')
const { Datee, Request } = require('erisjs-utils')

module.exports = new Command('register',{
  category : 'Account', help : 'Registro en el bot', args : '[dotaID] [steamID] [twitchID] [twitterID]'},
  function(msg, args, command){
    // let self = this
    const lang = this.locale.getUserStrings(msg)
    if(args.length < 2){
      return msg.replyDM(this.locale.replacer(lang.registerHelp))
    }else{
      if(args[1].length < 1 ){return msg.addReaction(this.config.emojis.default.error)}
      const server = this.config.guild
      const dotaID = args[1]
      return this.plugins.Account.get(msg.author.id)
        .then(account => {
          if (account) { return msg.reply(lang.errorProfileRegisteredAlready) }
          return this.plugins.Account.createProcess(msg.author.id, dotaID, msg)
          // return this.plugins.Opendota.account(dotaID).then((data) => {
          //   const [ result ] = data
          //   if (!result.profile) { return msg.reply(this.locale.replacer(lang.errorDotaIDNotValid, { id: dotaID })) };
          // })
        })
    }
})
