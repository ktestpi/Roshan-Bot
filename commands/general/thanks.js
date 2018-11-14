const { Command } = require('aghanim')
const message = require('../../containers/messages.json').thanks

module.exports = new Command('thanks',{
  category : 'General', help : 'Agradecimientos', args : ''},
  function(msg, args, command){
    const lang = this.locale.getUserStrings(msg)
    return msg.reply({
      embed: {
        title: lang.cmd_thanks_title,
        fields: [
          { name: lang.cmd_thanks_field0_name, value: this.config.others.betatesters.join(', '), inline: false },
          { name: lang.cmd_thanks_field1_name, value: this.config.others.complements.map(c => `${c.tag}: ${c.author}`).join('\n'), inline: false }
        ],
        color: this.config.color
      }
    })
  })
