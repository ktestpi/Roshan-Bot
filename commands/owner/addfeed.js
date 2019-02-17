const { Command } = require('aghanim')
const { Datee } = require('erisjs-utils')

module.exports = new Command('addfeed',{
  category : 'Owner', help : 'Añade un feed', args : '"título" "descripción" "link"',
  ownerOnly : true},
  async function(msg, args, client){
    if(!args.length){return}
    const matches = msg.content.match(/"[^"]+"/g)
    if(!matches.length){return}
    const now = Datee.custom(null,'ts')
    const update = {[now] : {title : matches[0].slice(1,-1), body : matches[1] ? matches[1].slice(1,-1) : '', link : matches[2] ?  matches[2].slice(1,-1) : ''}}
    return client.db.child('feeds').update(update).then(() => msg.addReaction(client.config.emojis.default.accept))
  })
