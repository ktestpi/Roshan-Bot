const { Command } = require('drow')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('svleave',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Roshan sale de un servidor', args : '<cmd>',
  ownerOnly : true},
  function(msg, args, command){
    // let self = this
    const sv = args[2]
    const guild = this.guilds.get(sv)
    if(!guild){return}
    this.leaveGuild(sv)
    msg.addReaction(config.emojis.default.accept)
    //TODO Logger
  })
