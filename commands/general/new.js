const { Command } = require('aghanim')
const { Markdown } = require('erisjs-utils')

module.exports = new Command('new',{
  category : 'General', help : 'Última update', args : ''},
  async function(msg, args, client){
    return msg.reply(client._lastUpdateText)
  })
