const { Command } = require('aghanim')
const message = require('../../containers/messages.json').errors

module.exports = new Command('errors',{
  category : 'General', help : 'Corrección de errores', args : ''},
  function(msg, args, command){
    const lang = this.locale.getUserStrings(msg)
    return msg.reply({ embed : {
      title: lang.cmd_errors_title,
      fields: [
        { name: lang.cmd_errors_field0_name, value: lang.cmd_errors_field0_value, inline : false},
        { name: lang.cmd_errors_field1_name, value: this.locale.replacer(lang.cmd_errors_field1_value), inline: false }
      ],
      color : this.config.color
    }})
  })
