const { Command } = require('aghanim')

module.exports = new Command('cachereload',{
  category : 'Owner', help : 'Recarga la cache', args : ''},
  async function(msg, args, client){
    return client.components.Cache.update()
  })
