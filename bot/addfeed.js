const { Command } = require('aghanim')
const { Datee } = require('erisjs-utils')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('addfeed',{
  category : 'Owner', help : 'Añade un feed', args : '"título" "descripción" "link"',
  ownerOnly : true},
  function(msg, args, command){
    // let self = this
    if(!args.length){return}
    const matches = msg.content.match(/"[^"]+"/g)
    if(!matches.length){return}
    const now = Datee.custom(null,'ts')
    const update = {[now] : {title : matches[0].slice(1,-1), body : matches[1] ? matches[1].slice(1,-1) : '', link : matches[2] ?  matches[2].slice(1,-1) : ''}}
    this.db.child('feeds').update(update).then(() => {msg.addReaction(this.config.emojis.default.accept)})
  })
