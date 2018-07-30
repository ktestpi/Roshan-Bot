const { Event } = require('aghanim')
const util = require('erisjs-utils')

module.exports = new Event('','messageReactionAdd',{}, function(msg,emoji,userID){
  // console.log('Watcher active',emoji,userID,this.config.emojis.default);
  if(userID === this.owner.id && msg.channel.guild && msg.channel.guild.id === this.config.guild.id){
    if(emoji.name === this.config.emojis.default.notification){
      msg.channel.getMessage(msg.id).then(m => {this.messageAllGuilds(m,false,'notifications')})
    }else if(emoji.name === this.config.emojis.default.loudspeaker){
      msg.channel.getMessage(msg.id).then(m => {this.messageAllGuilds(m,true,'notifications')})
    }else if(emoji.name == this.config.emojis.default.feeds){
      msg.channel.getMessage(msg.id).then(m => {this.messageAllGuilds(m,true,'feeds')})
    }
  }
})
