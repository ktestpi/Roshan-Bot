const { Command } = require('aghanim')
const { Datee } = require('erisjs-utils')

module.exports = new Command('deleteacc',{
  category : 'Owner', help : 'Elimina cuenta de Roshan', args : '<discordID>'},
  async function(msg, args, client){
    const user = client.users.get(args[1])
    if(!user){return msg.addReaction(client.config.emojis.default.error)}
    if(!client.cache.profiles.get(user.id)){return msg.addReaction(client.config.emojis.default.error)}
    const lang = client.locale.getDevStrings(msg)
    const guild = client.config.guild;
    const guildName = msg.channel.guild ? msg.channel.guild.name : 'DM';
    const guildID = msg.channel.guild ? msg.channel.guild.id : msg.channel.id;
    return client.createMessage(guild.accounts,{
      embed : {
        title : client.locale.replacer(lang.unregisterAccountTitle,{id : user.id}),
        description : client.locale.replacer(lang.unregisterAccountDesc,{guildName,guildID}),
        //thumbnail : {url : msg.author.avatarURL, height : 40, width : 40},
        footer : {text : user.username + ' | ' + user.id + ' | ' + Datee.custom(msg.timestamp,'D/M/Y h:m:s') ,icon_url : user.avatarURL},
        color : client.config.colors.account.delete
      }
    }).then((m) => {
      msg.addReaction(client.config.emojis.default.envelopeIncoming);
      return client.cache.profiles.remove(user.id).then(() => {
        client.components.Notifier.accountdelete(`Account deleted: **${msg.author.username}** (${msg.author.id})`)
        m.addReaction(client.config.emojis.default.accept)
      })
    })
  })
