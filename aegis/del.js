const { Command } = require('aghanim')

module.exports = new Command('del',
  {category : 'Aegis', help : 'Elimina los últimos <mensajes>', args : '<mensajes>',
    rolesCanUse : 'aegis'},
  function(msg, args, command){
    const limit = 100, min = 10;
    let messages = args[1] ? parseInt(args[1]) : min
    if(isNaN(messages)){return msg.reply(lang.errorMessagesToDelNumberNeccesary)};
    messages += 1;
    if(messages > limit){messages = limit+1};
    // const user = msg.channel.guild.members.get(msg.author.id)
    return msg.channel.getMessages(messages).then( m => {
      let promises = []
      for(i in m){
        promises.push(m[i].delete())
      }
      return Promise.all(promises)
    })
  })
