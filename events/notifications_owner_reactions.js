const { Event } = require('aghanim')

module.exports = new Event('notifications_owner_reactions','messageReactionAdd',{}, function(msg,emoji,userID){
  // console.log('Watcher active',emoji,userID,this.config.emojis.default);
  if(userID === this.owner.id && msg.channel.guild && msg.channel.guild.id === this.config.guild.id){
    if(emoji.name === this.config.emojis.default.notification){
      msg.channel.getMessage(msg.id).then(m => {this.messageAllGuilds(m,false,'notifications')})
    }else if(emoji.name === this.config.emojis.default.loudspeaker){
      msg.channel.getMessage(msg.id).then(m => {this.messageAllGuilds(m,true,'notifications')})
    }else if(emoji.name == this.config.emojis.default.feeds){
      msg.channel.getMessage(msg.id).then(m => {this.messageAllGuilds(m,false,'feeds')})
    }
  }
})
