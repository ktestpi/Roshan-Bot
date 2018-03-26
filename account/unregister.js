const { Command } = require('drow')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('unregister',{
  category : 'Cuenta', help : 'Elimina tu cuenta de Roshan', args : ''},
  function(msg, args, command){
    let self = this
    if(!self.cache.profiles.get(msg.author.id)){return msg.addReaction(this.config.emojis.default.error)}
    const guild = this.config.guild;
    const guildName = msg.channel.guild ? msg.channel.guild.name : 'DM';
    const guildID = msg.channel.guild ? msg.channel.guild.id : msg.channel.id;
    this.createMessage(guild.accounts,{
      embed : {
        title : 'Borrar cuenta - ' + msg.author.id,
        description : `**Guild/DM:** ${guildName} **ChannelID:** ${guildID}`,
        //thumbnail : {url : msg.author.avatarURL, height : 40, width : 40},
        footer : {text : msg.author.username + ' | ' + msg.author.id + ' | ' + util.date(msg.timestamp,'log') ,icon_url : msg.author.avatarURL},
        color : this.config.colors.account.delete
      }
    }).then((m) => {
      msg.addReaction(this.config.emojis.default.envelopeIncoming);
      this.logger.add('accountremove',msg.author.username,true);
      this.cache.profiles.erase(msg.author.id).then(() => {
        msg.channel.createMessage(this.replace.do('<roshan> **¡Tu cuenta ha sido eliminada!** :white_check_mark: <aegis>\n\n**<bot_name>** está triste. :sweat: ¡Esperámos que vuelvas pronto! :wink:')).then(() => m.addReaction(this.config.emojis.default.accept))
      })
    })
  })
