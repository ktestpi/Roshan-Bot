const { Command } = require('aghanim')

module.exports = new Command(['donate', 'patreon', 'kofi'],{
  category : 'General', help : '❤ Dona para apoyar el bot', args : ''},
  function(msg, args, command){
    return msg.reply(this.locale.replacer(this.locale.getUserString('linkPatreon', msg), { link_patreon: this.config.links.patreon, link_kofi: this.config.links.kofi}))
  })
