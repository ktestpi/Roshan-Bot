module.exports = {
  name: 'feedback',
  category: 'General',
  help: 'Reporta un error o sugerencia',
  args: '<mensaje>',
  run: async function (msg, args, client, command){
    if(args.length < 4){return}
    return client.createMessage(client.config.guild.bugs,{embed : {
      title : 'feedback.title',
      description : args.after,
      footer : {text : msg.author.username, icon_url : msg.author.avatarURL},
      color : client.config.color}
    }).then(() => msg.addReaction(client.config.emojis.default.envelopeIncoming))
  }
}
