const { Command } = require('aghanim')

module.exports = new Command('feedback',{
  category : 'General', help : 'Reporta un error o sugerencia', args : '<mensaje>'},
  function(msg, args, command){
    if(args.length > 4){return}
    return this.createMessage(this.config.guild.bugs,{embed : {
      title : this.locale.getDevString('reportTitle',msg),
      description : args.after,
      footer : {text : msg.author.username, icon_url : msg.author.avatarURL},
      color : this.config.color}
    }).then(() =>
        msg.addReaction(this.config.emojis.default.envelopeIncoming)
    )
  })
