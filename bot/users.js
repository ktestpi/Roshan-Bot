const { Command } = require('aghanim')
const lang = require('../lang.json')

module.exports = new Command('users',{
  category : 'Owner', help : 'Cantidad de usuari@s registrados', args : '<cmd>',
  ownerOnly : true},
  function(msg, args, command){
    const users = this.cache.profiles.getall().length
    msg.reply(this.replace.do(lang.usersAmount,{users: users},true));
  })
