const { Command } = require('aghanim')

module.exports = new Command('serverlang',{
  category : 'Server', help : 'Establece el idioma del servidor', args : '<idioma>',
  rolesCanUse : 'aegis'},
  function(msg, args, command){
    if(!args[1] || !this.locale.languages.includes(args[1].toLowerCase())){return msg.reply(this.locale.replacer(this.locale.getChannelString('langAvaliables',msg),{langs : this.locale.flags(l => `${l.flag} \`${l.lang}\``).join(', ')}))}
    return this.cache.servers.save(msg.channel.guild.id,{lang : args[1].toLowerCase()}).then(() => msg.addReaction(this.config.emojis.default.accept))
  })
