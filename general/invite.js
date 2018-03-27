const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('invite',{
  category : 'General', help : 'Invita a Roshan a tu servidor', args : ''},
  function(msg, args, command){
    let self = this
    console.log(this);
    msg.reply(this.replace.do(`<roshan> **Invitación**: ${this.config.invite}`))
  })
