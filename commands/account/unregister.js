const { Command } = require('aghanim')
const basic = require('../../helpers/basic')
const { Datee } = require('erisjs-utils')

module.exports = new Command('unregister',{
  category : 'Account', help : 'Elimina tu cuenta de Roshan', args : ''},
  function(msg, args, command){
    return this.plugins.Opendota.userID(msg, args)
      .then(player => {
        const guild = this.config.guild;
        const guildName = msg.channel.guild ? msg.channel.guild.name : 'DM';
        const guildID = msg.channel.guild ? msg.channel.guild.id : msg.channel.id;
        const lang = this.locale.getUserStrings(msg)
        return this.createMessage(guild.accounts,{
          embed : {
            title : this.locale.replacer(lang.unregisterAccountTitle,{id : msg.author.id}),
            description : this.locale.replacer(lang.unregisterAccountDesc,{guildName,guildID}),
            //thumbnail : {url : msg.author.avatarURL, height : 40, width : 40},
            footer : {text : msg.author.username + ' | ' + msg.author.id + ' | ' + Datee.custom(msg.timestamp,'D/M/Y h:m:s') ,icon_url : msg.author.avatarURL},
            color : this.config.colors.account.delete
          }
        }).then((m) => {
          msg.addReaction(this.config.emojis.default.envelopeIncoming)
          this.cache.profiles.erase(msg.author.id).then(() => {
            this.notifier.accountdelete(`Account deleted: **${msg.author.username}** (${msg.author.id})`)
            return msg.reply(this.locale.replacer(lang.accountDeleted)).then(() => m.addReaction(this.config.emojis.default.accept))
          })
        })
      })
  })
