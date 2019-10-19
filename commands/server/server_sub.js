const enumFeeds = require('../../enums/feeds')
const FirebaseArraySet = require('../../classes/firebasearrayset')

module.exports = {
  name: ['subscribe','sub'],
  childOf: 'server',
  category: 'Server',
  help: 'Subscripción de feeds',
  args: '<feeds separados por un espacio>',
  requirements: [
    {
      type: 'member.has.role',
      role: 'aegis',
      incaseSensitive: true
    }
  ],
  run: async function (msg, args, client, command){
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
      if(s){serversSubs.addVal(s);subsKey.push(s)}
    })
    if(!subsKey.length){return}
    return client.cache.servers.save(msg.channel.guild.id,{feeds : {subs : serversSubs.tostring}}).then(() => {
      msg.addReactionSuccess()
      return msg.reply('server.subscription',{subs : subsKey.map(s => `**${enumFeeds.getValue(s)}**`).join(', ')})
    }
    )
  }
}
