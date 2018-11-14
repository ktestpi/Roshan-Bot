const { Command } = require('aghanim')
const { Datee } = require('erisjs-utils')

module.exports = new Command('unregister',{
  category : 'Account', help : 'Elimina tu cuenta de Roshan', args : ''},
  function(msg, args, command){
    return this.plugins.Account.exists(msg.author.id)
      .then(account => this.plugins.Account.deleteProcess(account._id,msg))
  })
