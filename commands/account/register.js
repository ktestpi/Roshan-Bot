const { Command } = require('aghanim')
const { Datee, Request } = require('erisjs-utils')

module.exports = new Command('register',{
  category : 'Account', help : 'Registro en el bot', args : '<dotaID>'},
  async function(msg, args, client){
    if(args.length < 2){
      return msg.replyDM('register.help')
    }else{
      if(args[1].length < 1 ){return msg.addReactionFail()}
      const server = client.config.guild
      const dotaID = args[1]
      return this.components.Account.get(msg.author.id)
        .then(account => {
          if (account) { return msg.reply('register.alreadyregistered') }
          return client.components.Account.createProcess(msg.author.id, dotaID, msg)
        })
    }
})
