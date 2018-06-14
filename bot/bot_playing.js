const { Command } = require('aghanim')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('playing',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Establece el mensaje de Jugando a', args : '<mensaje>',
  ownerOnly : true},
  function(msg, args, command){
    if(args.length < 3){
      this.setStatus(0,null,this.config.playing,null,true).then(() => this.logger.add('bot', `Playing to default **${this.config.playing}**`,true)).catch(err => msg.reply(err))
    }else{
      const playing = args.from(2)
      if(!playing){return};
      this.setStatus(0,null,playing,null,true).then(() => this.logger.add('bot', `Playing: **${playing}**`,true)).catch(err => msg.reply(':x: Error Ocurred!'))
    }
  })
