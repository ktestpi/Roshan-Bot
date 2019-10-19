module.exports = {
  name: 'ping',
  category : 'Owner',
  help : 'Ping!',
  args : '',
  hide : true,
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    const date = new Date().getTime()
    return msg.reply(`Ping: ${date - msg.timestamp} ms`).then((m) => {setTimeout(() => {m.delete()},5000)})
  }
}
