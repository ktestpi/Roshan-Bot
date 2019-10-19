module.exports = {
  name: ['supp'],
  category : 'Owner', help : 'Supports', args : '[<add/remove> <mención>]',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    // if(!args[1]){return}
    if(['add','remove'].includes(args[1]) && args.length > 2){
      const cmd = args[1]
      const members = msg.mentions.map(m => m.id)
      const regex = new RegExp('\\d+')
      for (var i = 2; i < args.length; i++) {
        if(regex.test(args[i])){members.push(args[i])}
      }
      if(!members.length){return}
      let promises = []
      members.forEach(m => promises.push(cmd === 'add' ? client.cache.supporters.include(m) : client.cache.supporters.exclude(m)))
      Promise.all(promises).then(msg.addReaction(client.config.emojis.default.accept)).catch(() => msg.reply(':x: Ha ocurrido un error'))
    }else{
      const supporters = client.components.Bot.supporters().map(id => {
          const user = client.users.get(id)
          return user ? user.username : id
      })
      msg.reply({embed : {
        title : `Supports (${supporters.length})`,
        description : supporters.join(', '),
        color : client.config.color
      }})
    }
  }
}
