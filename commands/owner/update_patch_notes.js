const { Command } = require('aghanim')

module.exports = new Command('updatepatchnotes',{
  category : 'Owner', help : 'Recarga el mensaje de r!new', args : ''},
  async function(msg, args, client){
    return client.components.Bot.loadLastPatchNotes()
  })
