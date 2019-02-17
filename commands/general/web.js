const { Command } = require('aghanim')

module.exports = new Command('web',{
  category : 'General', help : 'RoshanApp', args : ''},
  async function(msg, args, client){
    return msg.reply('web.text')
  })
