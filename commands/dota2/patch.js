module.exports = {
  name: 'patch',
  category : 'Dota 2',
  help : 'Parche actual de dota',
  args : '',
  response: (msg, args, client, command) => client.cache.dota2Patch,
}
