const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const lang = require('../lang.json')

module.exports = new Command('deleteacc',{
  category : 'Owner', help : 'Elimina cuenta de Roshan', args : '<discordID>'},
  function(msg, args, command){
    const user = this.users.get(args[1])
    if(!user){return msg.addReaction(this.config.emojis.default.error)}
    if(!this.cache.profiles.get(user.id)){return msg.addReaction(this.config.emojis.default.error)}
    const guild = this.config.guild;
    const guildName = msg.channel.guild ? msg.channel.guild.name : 'DM';
    const guildID = msg.channel.guild ? msg.channel.guild.id : msg.channel.id;
    this.createMessage(guild.accounts,{
      embed : {
        title : lang.unregisterAccountTitle.replaceKey({id : user.id}),
        description : lang.unregisterAccountDesc.replaceKey({guildName,guildID}),
        //thumbnail : {url : msg.author.avatarURL, height : 40, width : 40},
        footer : {text : user.username + ' | ' + user.id + ' | ' + date.custom(msg.timestamp,'D/M/Y h:m:s') ,icon_url : user.avatarURL},
        color : this.config.colors.account.delete
      }
    }).then((m) => {
      msg.addReaction(this.config.emojis.default.envelopeIncoming);
      this.discordLog.controlMessage('accountremove',user.username,'')
      this.cache.profiles.erase(user.id).then(() => {
        m.addReaction(this.config.emojis.default.accept)
        // msg.channel.createMessage(this.replace.do(lang.accountDeleted)).then(() => )
      })
    })
  })
