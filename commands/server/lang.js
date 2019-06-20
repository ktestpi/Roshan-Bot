const { Command } = require('aghanim')

module.exports = new Command('lang', {subcommandFrom: 'server',
  category : 'Server', help : 'Establece el idioma del servidor', args : '<idioma>',
  rolesCanUse : 'aegis'},
  async function (msg, args, client, command){
    const lang = args[2]
    if (!lang || !client.components.Locale.languages.includes(lang.toLowerCase())) {
      return msg.reply('lang.avaliable',{
        langs : client.components.Locale.flags().map(l => `${l.flag} \`${l.lang}\``).join(', ')
      })
    }
    return client.cache.servers.save(msg.channel.guild.id,{lang : lang.toLowerCase()})
      .then(() => msg.addReaction(client.config.emojis.default.accept))
  })
