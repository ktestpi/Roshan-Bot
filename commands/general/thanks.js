const { Command } = require('aghanim')
const basic = require('../../helpers/basic')
const message = require('../../containers/messages.json').thanks

module.exports = new Command('thanks',{
  category : 'General', help : 'Agradecimientos', args : ''},
  function(msg, args, command){
    let embed = basic.replaceMessageFields(message,{},this.replace,(text) => basic.parseText(text,'nf'))
    if(embed.color){embed.color = basic.replaceColor(embed.color,this.config.colors.palette)}
    return msg.reply({embed})
  })
