const { Command } = require('aghanim')
const enumFeeds = require('../../enums/feeds')
const FirebaseArraySet = require('../../classes/firebasearrayset')

module.exports = new Command(['unsubscribe','unsub'],{subcommandFrom : 'server',
  category : 'Server', help : 'Desuscribción de feeds', args : '<feeds separados por un espacio>',
  rolesCanUse: 'aegis'},
  async function(msg, args, client){
    const content = args.from(2)
    if(!content){return}
    const subs = content.split(' ')
    if(!subs.length){return}
    const server = client.cache.servers.get(msg.channel.guild.id)
    if(!server){return}
    const serversSubs = new FirebaseArraySet(server.feeds.subs,enumFeeds.toArray().map(e => e.key))
    const subsKey = []
    subs.forEach(sub => {
      const s = enumFeeds.getKey(sub)
      if(s){serversSubs.deleteVal(s);subsKey.push(s)}
    })
    if(!subsKey.length){return}
    return client.cache.servers.save(msg.channel.guild.id,{feeds : {subs : serversSubs.tostring}}).then(() => {
      msg.addReactionSuccess()
      return msg.reply('server.unsubscription',{subs : subsKey.map(s => `**${enumFeeds.getValue(s)}**`).join(', ')})
    })
  })
