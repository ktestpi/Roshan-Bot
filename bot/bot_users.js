const { Command } = require('drow')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('users',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Cantidad de usuari@s registrados', args : '<cmd>',
  ownerOnly : true},
  function(msg, args, command){
    let self = this
    const users = this.cache.profiles.getall().length
    msg.reply(this.replace.do(lang.usersAmount,{users: users},true));
  })
