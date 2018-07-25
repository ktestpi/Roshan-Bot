const { Command } = require('aghanim')
// const util = require('/erisjs-utils')
const opendota = require('../helpers/opendota')
// const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('feedback',{
  category : 'General', help : 'Reporta un error o sugerencia', args : '<mensaje>'},
  function(msg, args, command){
    if(args.length > 4){
      this.createMessage(this.config.guild.bugs,{embed : {title : lang.reportTitle, description : args.after, footer : {text : msg.author.username, icon_url : msg.author.avatarURL}, color : this.config.color}}).then(() => msg.addReaction(this.config.emojis.default.envelopeIncoming));
    }
  })
