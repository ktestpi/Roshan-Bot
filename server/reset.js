const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')
const on = 'on'
const off = 'off'

module.exports = new Command('reset',{subcommandFrom : 'server',
  category : 'Server', help : 'Reinicia configuración del servidor', args : '',
  rolesCanUse: 'aegis'},
  function(msg, args, command){
    basic.resetServerConfig(this,msg.channel.guild).then(() => msg.reply(lang.serverConfigReseted))
  })
