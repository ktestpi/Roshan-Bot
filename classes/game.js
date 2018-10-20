const fs = require('fs')
const Event = require('event')

module.exports = class RoshanGame extends Event{
  constructor(name,category,description,config,status){
    super()
    this.name = name
    this.category = category
    this.description = description
    this.config = config
    this.status = status
    this.commands = []
    this.on('error', function(err){
      console.log(this.name + ':ERROR:' + err);
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
  addEvent(ev){
    this.addDir(path,'events')
  }
  readDirFiles(path){
    return fs.readdirSync(path)
  }
  insert(bot){
    bot.addCategory(this.category,this.categoryHelp)
    game.commands.forEach(cmd => {cmd.game = this;bot.addCommand(cmd)})
    game.events.forEach(ev => bot.addEvent(ev))
  }
}


// bot.games = bot.games || {}
// bot.games[game.id] =
