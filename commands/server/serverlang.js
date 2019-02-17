const { Command } = require('aghanim')

module.exports = new Command('serverlang',{
  category : 'Server', help : 'Establece el idioma del servidor', args : '<idioma>',
  rolesCanUse : 'aegis'},
  async function(msg, args, client){
    if (!args[1] || !client.locale.languages.includes(args[1].toLowerCase())) { return msg.reply('lang.avaliable',{langs : client.locale.flags(l => `${l.flag} \`${l.lang}\``).join(', ')})}
    return client.cache.servers.save(msg.channel.guild.id,{lang : args[1].toLowerCase()}).then(() => msg.addReaction(client.config.emojis.default.accept))
  })
