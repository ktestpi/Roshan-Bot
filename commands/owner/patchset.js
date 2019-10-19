module.exports = {
  name: 'setpatch',
  category : 'Owner',
  help : 'Actualiza el mensaje de `r!patch`',
  args : '<mensaje del parche>',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    const patch = args.from(1)
    return client.db.child('bot').update({patch : patch}).then(() => {
      client.cache.dota2Patch = patch
      return msg.addReaction(client.config.emojis.default.accept)
    })
  }
}
