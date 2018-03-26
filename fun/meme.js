const { Command } = require('drow')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const links = require('../containers/memes.json')

module.exports = new Command('meme',{
  category : 'Fun', help : 'Memes de Dota 2', args : '<meme>'},
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
