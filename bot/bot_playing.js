const { Command } = require('drow')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('playing',{subcommandFrom : 'bot',
  category : 'Owner', help : 'Establece el mensaje de Jugando a', args : '<mensaje>',
  ownerOnly : true},
  function(msg, args, command){
    let self = this
    if(args.length < 3){
      this.db.child('bot').once('value').then(snap => {
        const playing = snap.val() ? snap.val().playing : this.config.playing
        this.editStatus("online", {name : playing, type : 0})
        this.logger.add('bot', `Playing: **${playing}**`,true)
      });
    }else{
      const playing = args.slice(2).join(' ')
      if(!playing){return};
      this.db.child('bot').update({playing : playing}).then(() => {
      this.editStatus("online", {name : playing, type : 0})
        msg.addReaction(this.config.emojis.default.accept)
        this.logger.add('bot', `Playing: **${playing}**`,true)
      }).catch(err => this.editStatus("online", {name : playing, type : 0}))
    }
  })
