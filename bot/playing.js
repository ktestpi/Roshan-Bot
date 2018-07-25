const { Command } = require('aghanim')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('playing',{
  category : 'Owner', help : 'Establece el mensaje de Jugando a', args : '<mensaje>',
  ownerOnly : true},
  function(msg, args, command){
    if(args.length < 2){
      this.setStatus(0,null,this.config.playing,null,true).then(() => this.discordLog.controlMessage('bot', `Playing to default **${this.config.playing}**`)).catch(err => this.discordLog.controlMessage('error','No se pudo cambiar el estado',err))
    }else{
      const playing = args.from(1)
      if(!playing){return};
      this.setStatus(0,null,playing,null,true).then(() => this.discordLog.controlMessage('bot', `Playing: **${playing}**`)).catch(err => this.discordLog.controlMessage('error','No se pudo cambiar el estado',err))
    }
  })
