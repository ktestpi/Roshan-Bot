const { Command } = require('drow')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const message = require('../containers/messages.json').errors

module.exports = new Command('errors',{subcommandFrom : 'about',
  category : 'General', help : 'Corrección de errores', args : ''},
  function(msg, args, command){
    let self = this
    let embed = basic.replaceMessageFields(message,{},this.replace,(text) => basic.parseText(text,'nf'))
    if(embed.color){embed.color = basic.replaceColor(embed.color,this.config.colors.palette)}
    msg.reply({embed})
  })
