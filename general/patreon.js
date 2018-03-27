const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('patreon',{
  category : 'General', help : '❤ Dona para apoyar el bot', args : ''},
  function(msg, args, command){
    let self = this
    msg.reply(this.replace.do(`<patreon> **Patreon**: ${this.config.links.patreon}`))
  })
