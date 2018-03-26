const { Command } = require('drow')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const links = require('../containers/charms.json')

module.exports = new Command('anicharm',{
  category : 'Fun', help : 'Emojis animados brillantes de Dota 2', args : '<emoji>'},
  function(msg, args, command){
    let self = this
    // if(!emojis[args[1]]){return} // TODO wrongCmd
    // const query = emojis[args[1]]
    // if(typeof query === 'object'){
    //   util.msg.sendImage_(query.file).then(buffer => {
    //     msg.reply(query.name,{file : buffer, name : query.name})
    //   })
    // }else if(typeof query === 'string'){
    //   msg.reply(query)
    // }
    basic.sendImageStructure(msg,args[1],links,args.until(1))
  })
