const fs = require('fs')
const Events = require('events')

module.exports = class RoshanGame extends Events{
  constructor(name,category,config,status){
    super()
    this.name = name
    this.category = category
    this.config = config
    this.status = status
    this.commands = []
    this.events = []
    this.actions = {}
    this.on('error', function(err){
      console.log(this.name + ':ERROR:' + err)
    })
  }
  addCommandsDir(path){
    this.addDir(path,'commands')
  }
  addDir(path,where){
    this.readDirFiles(path).forEach(file => {
      this[where].push(require(path + '/' + file))
    })
  }
  addEventsDir(path){
    this.addDir(path,'events')
  }
  addEvent(ev){
    this.addDir(path,'events')
  }
  readDirFiles(path){
    return fs.readdirSync(path)
  }
  addActions(actions){
    Object.keys(actions).forEach(key => {
      this.addAction(actions[key],key)
    })
  }
  addAction(action,key){
    this.actions[key] = action.bind(this)
  }
  reply(channel,content,file){
    return this.client.createMessage(typeof channel === 'string' ? channel : channel.channel.id,content,file)
  }
  replyDM(msg,content,file){
    return msg.author.getDMChannel().then((channel) => channel.createMessage(content,file))
  }
  log(content,file){
    return this.reply(this.config.logChannel,content,file)
  }
}


// bot.games = bot.games || {}
// bot.games[game.id] =
