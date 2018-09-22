const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const { Datee } = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('unregister',{
  category : 'Account', help : 'Elimina tu cuenta de Roshan', args : ''},
  function(msg, args, command){
    if(!this.cache.profiles.get(msg.author.id)){return msg.addReaction(this.config.emojis.default.error)}
    const guild = this.config.guild;
    const guildName = msg.channel.guild ? msg.channel.guild.name : 'DM';
    const guildID = msg.channel.guild ? msg.channel.guild.id : msg.channel.id;
    this.createMessage(guild.accounts,{
      embed : {
        title : lang.unregisterAccountTitle.replaceKey({id : msg.author.id}),
        description : lang.unregisterAccountDesc.replaceKey({guildName,guildID}),
        //thumbnail : {url : msg.author.avatarURL, height : 40, width : 40},
        footer : {text : msg.author.username + ' | ' + msg.author.id + ' | ' + Datee.custom(msg.timestamp,'D/M/Y h:m:s') ,icon_url : msg.author.avatarURL},
        color : this.config.colors.account.delete
      }
    }).then((m) => {
      msg.addReaction(this.config.emojis.default.envelopeIncoming);
      this.discordLog.controlMessage('accountremove',msg.author.username,'')
      this.cache.profiles.erase(msg.author.id).then(() => {
        msg.channel.createMessage(this.replace.do(lang.accountDeleted)).then(() => m.addReaction(this.config.emojis.default.accept))
      })
    })
  })
