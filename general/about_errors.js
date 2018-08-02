const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const message = require('../containers/messages.json').errors

module.exports = new Command('errors',{subcommandFrom : 'about',
  category : 'General', help : 'Corrección de errores', args : ''},
  function(msg, args, command){
    let embed = basic.replaceMessageFields(message,{},this.replace,(text) => basic.parseText(text,'nf'))
    if(embed.color){embed.color = basic.replaceColor(embed.color,this.config.colors.palette)}
    msg.reply({embed})
  })
