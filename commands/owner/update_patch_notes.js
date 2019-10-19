const { Command } = require('aghanim')

module.exports = {
  name: 'updatepatchnotes',
  category : 'Owner',
  help : 'Recarga el mensaje de r!new',
  args : '',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    return client.components.Bot.loadLastPatchNotes()
  }
}
