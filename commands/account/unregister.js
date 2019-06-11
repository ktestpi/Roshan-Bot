const { Command } = require('aghanim')
const { Datee } = require('erisjs-utils')

module.exports = new Command('unregister',{
  category : 'Account', help : 'Elimina tu cuenta de Roshan', args : ''},
  async function (msg, args, client, command){
    return client.components.Account.exists(msg.author.id)
      .then(account => client.components.Account.deleteProcess(account._id, msg))
  })
