const { Command } = require('aghanim')

module.exports = new Command('ping',{
  category : 'Owner', help : 'Ping!', args : '',
  ownerOnly : true, hide : true},
  function(msg, args, command){
    // let self = this
    const date = new Date().getTime()
    msg.reply(`Ping: ${date - msg.timestamp} ms`).then((m) => {setTimeout(() => {m.delete()},5000)})
  })
