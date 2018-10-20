const { Command } = require('aghanim')

module.exports = new Command('users',{
  category : 'Owner', help : 'Cantidad de usuari@s registrados', args : '',
  ownerOnly : true},
  function(msg, args, command){
    const users = this.cache.profiles.getall().length
    msg.reply(this.locale.replacer(this.locale.getUserString('usersAmount',msg),{users}));
  })
