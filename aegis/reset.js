const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const on = 'on'
const off = 'off'

module.exports = new Command('reset',{subcommandFrom : 'server',
  category : 'Aegis', help : 'Muestra la configuración del servidor', args : '',
  rolesCanUse: 'aegis'},
  function(msg, args, command){
    let self = this
    basic.resetServerConfig(this,msg.channel.guild).then(() => msg.addReaction(this.config.emojis.default.accept))
  })
