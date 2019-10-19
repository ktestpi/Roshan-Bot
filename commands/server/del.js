module.exports = {
  name: 'del',
  category: 'Server',
  help: 'Elimina los últimos <mensajes>',
  args: '<mensajes>',
  requirements: [
    {
      type: 'member.has.role',
      role: 'aegis',
      incaseSensitive: true
    }
  ],
  run: async function (msg, args, client, command){
    const limit = 100, min = 10;
    let messages = args[1] ? parseInt(args[1]) : min
    if (isNaN(messages)) { return msg.reply('del.neednumbermessages')}
    messages += 1;
    if(messages > limit){messages = limit+1};
    return msg.channel.getMessages(messages).then( m => {
      let promises = []
      for(i in m){
        promises.push(m[i].delete())
      }
      return Promise.all(promises)
    })
  }
}
