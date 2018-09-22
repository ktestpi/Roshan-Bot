const { Event } = require('aghanim')

module.exports = new Event('','messageCreate',{}, function(msg){
  if(this.config.guild.feedsHidden === msg.channel.id && this.config.switches.feeds && this.config.webhooks.feedsHidden === msg.author.id){
    this.messageAllGuilds(msg,false,'feeds');
    msg.addReaction(this.config.emojis.default.feeds)
  }
})
