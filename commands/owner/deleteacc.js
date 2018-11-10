const { Command } = require('aghanim')
const { Datee } = require('erisjs-utils')

module.exports = new Command('deleteacc',{
  category : 'Owner', help : 'Elimina cuenta de Roshan', args : '<discordID>'},
  function(msg, args, command){
    const user = this.users.get(args[1])
    if(!user){return msg.addReaction(this.config.emojis.default.error)}
    if(!this.cache.profiles.get(user.id)){return msg.addReaction(this.config.emojis.default.error)}
    const lang = this.locale.getDevStrings(msg)
    const guild = this.config.guild;
    const guildName = msg.channel.guild ? msg.channel.guild.name : 'DM';
    const guildID = msg.channel.guild ? msg.channel.guild.id : msg.channel.id;
    return this.createMessage(guild.accounts,{
      embed : {
        title : this.locale.replacer(lang.unregisterAccountTitle,{id : user.id}),
        description : this.locale.replacer(lang.unregisterAccountDesc,{guildName,guildID}),
        //thumbnail : {url : msg.author.avatarURL, height : 40, width : 40},
        footer : {text : user.username + ' | ' + user.id + ' | ' + Datee.custom(msg.timestamp,'D/M/Y h:m:s') ,icon_url : user.avatarURL},
        color : this.config.colors.account.delete
      }
    }).then((m) => {
      msg.addReaction(this.config.emojis.default.envelopeIncoming);
      return this.cache.profiles.erase(user.id).then(() => {
        this.notifier.accountdelete(`Account deleted: **${msg.author.username}** (${msg.author.id})`)
        m.addReaction(this.config.emojis.default.accept)
      })
    })
  })
