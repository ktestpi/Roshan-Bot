const { Command } = require('aghanim')
const lang = require('../lang.json')

module.exports = new Command('web',{
  category : 'Dota 2', help : 'RoshanApp', args : ''},
  function(msg, args, command){
    msg.reply(this.replace.do(lang.web,{link : this.config.links.web}))
  })
