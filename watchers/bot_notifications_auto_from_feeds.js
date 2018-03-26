const { Watcher } = require('drow')
const util = require('erisjs-utils')

module.exports = new Watcher('','messageCreate',{}, function(msg){
  if(msg.channel.id == this.config.guild.feeds && this.config.switches.feeds && msg.author.id == this.config.webhooks.feedsNotification){
    this.messageAllGuilds(msg,false,'feeds');
    msg.addReaction(this.config.emojis.default.feeds)
  }
})
