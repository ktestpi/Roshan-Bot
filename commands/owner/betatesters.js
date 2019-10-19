module.exports = {
  name: ['beta'],
  category : 'Owner',
  help : 'Betatesters',
  args : '[<add/remove> <mención>]',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    if(['add','remove'].includes(args[1]) && args.length > 2){
      const cmd = args[1]
      const members = msg.mentions.map(m => m.id)
      const regex = new RegExp('\\d+')
      for (var i = 2; i < args.length; i++) {
        if(regex.test(args[i])){members.push(args[i])}
      }
      if(!members.length){return}
      const promises = []
      members.forEach(m => promises.push(cmd === 'add' ? client.cache.betatesters.include(m) : client.cache.betatesters.exclude(m)))
      return Promise.all(promises).then(msg.addReaction(client.config.emojis.default.accept)).catch(() => msg.reply(':x: Ha ocurrido un error'))
    }else{
      const betatesters = client.components.Bot.betatesters().map(id => {
          const user = client.users.get(id)
          return user ? user.username : id
      })
      return msg.reply({embed : {
        title : `Betatesters (${betatesters.length})`,
        description : betatesters.join(', '),
        color : client.config.color
      }})
    }
  }
}
