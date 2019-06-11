const { Command } = require('aghanim')

module.exports = new Command(['donate', 'patreon', 'kofi'],{
  category : 'General', help : '❤ Dona para apoyar el bot', args : ''},
  async function(msg, args, client, command){
    return msg.reply('donate.text')
  })
