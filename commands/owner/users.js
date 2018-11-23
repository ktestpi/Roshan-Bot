const { Command } = require('aghanim')

module.exports = new Command('users',{
  category : 'Owner', help : 'Cantidad de usuari@s registrados', args : '',
  ownerOnly : true},
  function(msg, args, command){
    return msg.reply(this.locale.replacer(this.locale.getUserString('usersAmount', msg), { users: this.cache.profiles.size}));
  })
