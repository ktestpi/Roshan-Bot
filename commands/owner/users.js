const { Command } = require('aghanim')

module.exports = new Command('users',{
  category : 'Owner', help : 'Cantidad de usuari@s registrados', args : '',
  ownerOnly : true},
  async function(msg, args, client){
    return msg.reply('users.amount', { users: client.cache.profiles.size})
  })
