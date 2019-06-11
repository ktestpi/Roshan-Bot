const { Command } = require('aghanim')

module.exports = new Command('invite',{
  category : 'General', help : 'Invita a Roshan a tu servidor', args : ''},
  async function(msg, args, client, command){
    return msg.reply('invite.text')
  })
