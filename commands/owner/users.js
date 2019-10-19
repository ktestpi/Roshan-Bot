module.exports = {
  name: 'users',
  category : 'Owner',
  help : 'Cantidad de usuari@s registrados',
  args : '',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    return msg.reply('users.amount', { users: client.cache.profiles.size})
  }
}
