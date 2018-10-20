const { Classes } = require('erisjs-utils')

module.exports = class DiscordLogger extends Classes.Logger{
  constructor(channel,options){
    const customLogs = options.events.map(event => ({name : event.tag.toUpperCase(), level : event.level, color : event.color}))
    super(options.name,options.level,customLogs)
    this.channel = channel
    this.dmMessage = options.dmMessage || false
    this.bucket = []
    this.events = {} //{icon,tag,tochannel,touser}
    options.events.forEach(event => {
      if(!this.events[event.tag]){
        this.events[event.tag] = {icon : event.icon, level : event.level}
      }
    })
    this.messages = options.messages || 10
  }
  composeMsg(mode,message,description){
    const premsg = this._getIconPreMsg(mode)
    return { content : typeof message === 'string' ? premsg + message + (description ? '\n```' + description + '```' : '') : undefined, embed : typeof message === 'object' ? message : undefined}
  }
  _getIconPreMsg(mode){
    return this.events[mode] ? this.events[mode].icon + ' ' : mode
  }
  controlMessage(mode,message,description){
    return this.channel.createMessage(this.composeMsg(mode,message,description))
  }
  channelMessage(mode,message,channel){
    return channel.createMessage(this.composeMsg(mode,message,null))
  }
  userMessage(mode,message,user){
    const content = this.composeMsg(mode,message,null)
    return this.dmMessage ? user.getDMChannel().then(channel => channel.createMessage(content)) : user.createMessage(content)
  }
  chainControl(mode,message,description){
    this.controlMessage(mode,message,description)
    return this
  }
  chainChannel(mode,message,channel){
    this.channelMessage(mode,message,channel)
    return this
  }
  chainUser(mode,message,user){
    this.userMessage(mode,message,user)
    return this
  }
  then(){

  }
  send(mode,controlMsg,userMsg,description,userChannel){
    if(!controlMsg && !userMsg){throw new Error('Ningún mensaje ha sido definido')}
    return new Promise((resolve,reject) => {
      let promises = []
      if(controlMsg){promises.push(this.controlMessage(mode,controlMsg,description))}
      if(userMsg){
        if(userChannel.createMessage){
          promises.push(this.channelMessage(mode,userMsg,userChannel))
        }else{
          promises.push(this.userMessage(mode,userMsg,userChannel))
        }
      }
      this.log(mode,controlMsg+'\n'+(description ? (description.stack ? description.stack : description ) : ''))
      return Promise.all(promises)
    })
  }
}
