module.exports = class GameAnnouncer{
  constructor(game,logChannel){
    this.client = game.client
    this.game = game
    this.logChannel = logChannel
  }
  reply(channel,content,file){
    return this.client.createMessage(typeof channel === 'string' ? channel : channel.channel.id,content,file)
  }
  replyDM(channel,content,file){
    return channel.getDMChannel().then(() => channel.createMessage(content,file))
  }
  log(content,file){
    return this.send(this.logChannel,content,file)
  }
}
