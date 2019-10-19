module.exports = {
  name: 'cachereload',
  category : 'Owner',
  help : 'Recarga la cache',
  args : '',
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    return client.components.Cache.update()
  }
}
