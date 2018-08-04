const { Extension } = require('aghanim')
const Eris = require('eris')
const { Message, Guild } = require('erisjs-utils')
const { resetServerConfig } = require('../helpers/basic.js')

module.exports = new Extension('bot_extensions',function(bot){
  bot.setStatus = function(type,status,msg,url,update){
    // let self = this
    this.config.status = status !== null ? status : this.config.status
    this.config.status_act = type !== null ? type : this.config.status_act
    this.config.status_msg = msg !== null ? msg : this.config.status_msg
    this.config.status_url = url !== null ? url : this.config.status_url
    let promises = []
    if(update){
      promises.push(bot.db.child('bot').update({status : this.config.status, status_act : this.config.status_act, status_msg : this.config.status_msg, status_url : this.config.status_url}))
    }
    promises.push(this.editStatus(this.config.status, {name : this.config.status_msg, type : this.config.status_act, url : this.config.status_url}))
    return Promise.all(promises)
  }
  // console.log('HELLOOOOO');
  bot.messageAllGuilds = function(msg,all,mode){
    if(!this.config.switches.msgGuilds){return}
    const message = mode !== 'feeds' ? msg.content : `${this.config.emojis.default.feeds} **${msg.author.username}**:\n${msg.content}`;
    const servers = this.guilds.map(g => g)//this.cache.servers.getall()
    if(!servers){return};
    if(msg.attachments.length < 1){
      servers.forEach(server => {
        const cached = this.cache.servers.get(server.id)
        if(!cached){resetServerConfig(this,guild).then(() => this.discordLog.controlMessage('guildnew',`**${guild.name}**`)).catch(err => this.discordLog.controlMessage('error',`Error creating config for **${server.name}** (${server.id})`,null,err))}
        if(!all && cached && !cached[mode].enable){return};
        const channel = cached ? cached[mode].channel : Guild.getDefaultChannel(server,this,true).id
        this.createMessage(channel,{content: message, embed : msg.embeds.length > 0 ? msg.embeds[0] : {},disableEveryone:false}).catch(err => {
          // Create the message to defaultChannel of guild (not cofigurated)
          // this.createMessage(Guild.getDefaultChannel(server,this,true).id,{content: message, embed : msg.embeds.length > 0 ? msg.embeds[0] : {},disableEveryone:false})
          this.discordLog.controlMessage('error',`Error al enviar un mensaje a la guild\n**${server.name}** (${server.id}) [#${channel}]`,null,err)
        })
      })
    }else{
      Message.sendImage(msg.attachments[0].url).then(buffer => {
        servers.forEach(server => {
          const cached = this.cache.servers.get(server.id)
          if(!cached){resetServerConfig(this,guild).then(() => this.discordLog.controlMessage('guildnew',`**${guild.name}**`)).catch(err => this.discordLog.controlMessage('error',`Error creating config for **${server.name}** (${server.id})`))}
          if(!all && cached && !cached[mode].enable){return};
          const channel = cached ? cached[mode].channel : Guild.getDefaultChannel(server,this,true).id
          this.createMessage(channel,{content: message, embed : msg.embeds.length > 0 ? msg.embeds[0] : {},disableEveryone:false},{file : results, name : msg.attachments[0].filename}).catch(err => {
            // Create the message to defaultChannel of guild (not cofigurated)
            // this.createMessage(Guild.getDefaultChannel(server,this,true).id,{content: message, embed : msg.embeds.length > 0 ? msg.embeds[0] : {},disableEveryone:false},{file : results, name : msg.attachments[0].filename})
            this.discordLog.controlMessage('error',`Error al enviar un mensaje a la guild\n**${server.name}** (${server.id}) [#${channel}]`,null,err)
          })
        })
      })
    }
    // if(!notAll){config.logger.add(mode,message,true)}else{config.logger.add('shout',message,true);}
  }

  bot.scriptsUpdate = function(){
    return new Promise((resolve, reject) => {
      this.scripts = {};
      this.getMessages('470189277544841226').then(messages => {messages
        .filter(m => m.content.startsWith('🇫'))
        .map(m => ({tag: m.content.match(/\*\*(\w+)\*\*/)[1], src : m.content.match(/\`\`\`js[\n]?(.+)[\n]?\`\`\`/)[1]}))
        .forEach(c => {try{this.scripts[c.tag] = eval(`${c.src}`)}catch(err){return this.discordLog.log('error','Error loading scripts\n'+err.stack)}})
        this.discordLog.log('info','Scripts loaded')
        resolve()
      })
    })
  }

  bot.cacheReload = function(){
    return this.db.once('value').then(snap => {
      if(!snap.exists()){this.discordLog.controlMessage('error','Error al recargar','')}else{snap = snap.val()}
      this.cache.profiles = new FirebaseCache(this.db.child('profiles'),Object.keys(snap.profiles).map(profile => [profile,snap.profiles[profile]]));
      this.cache.servers = new FirebaseCache(this.db.child('servers'),snap.servers);
      this.cache.betatesters = new FireSetCache(this.db.child('betatesters'),[this.owner.id,...this.server.membersWithRole(this.config.roles.betatester).map(m => m.id),...snap.betatesters ? Object.keys(snap.betatesters).filter(b => snap.betatesters[b]) : []])
      this.cache.supporters = new FireSetCache(this.db.child('supporters'),[...this.server.membersWithRole(this.config.roles.supporter).map(m => m.id),...snap.supporters ? Object.keys(snap.supporters).filter(b => snap.betatesters[b]) : []])
    })
  }
})
