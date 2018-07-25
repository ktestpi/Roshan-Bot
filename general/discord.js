const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command(['discord','foso','devserver'],{
  category : 'General', help : 'Invitación al Discord de desarrollo de Roshan', args : ''},
  function(msg, args, command){
    msg.reply(this.replace.do(lang.inviteDevServer,{link : this.config.server},true))
  })
