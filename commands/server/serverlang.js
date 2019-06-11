const { Command } = require('aghanim')

module.exports = new Command('serverlang',{
  category : 'Server', help : 'Establece el idioma del servidor', args : '<idioma>',
  rolesCanUse : 'aegis'},
  async function (msg, args, client, command){
    if (!args[1] || !client.components.Locale.languages.includes(args[1].toLowerCase())) { return msg.reply('lang.avaliable',{langs : client.components.Locale.flags().map(l => `${l.flag} \`${l.lang}\``).join(', ')})}
    return client.cache.servers.save(msg.channel.guild.id,{lang : args[1].toLowerCase()}).then(() => msg.addReaction(client.config.emojis.default.accept))
  })
