const { Command } = require('aghanim')

module.exports = new Command('ping',{
  category : 'Owner', help : 'Ping!', args : '',
  ownerOnly : true, hide : true},
  async function(msg, args, client){
    const date = new Date().getTime()
    return msg.reply(`Ping: ${date - msg.timestamp} ms`).then((m) => {setTimeout(() => {m.delete()},5000)})
  })
