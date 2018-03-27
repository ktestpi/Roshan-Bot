const { Command } = require('aghanim')
// const opendota = require('../helpers/opendota')
// const basic = require('../helpers/basic')
// const lang = require('../lang.json')
// const util = require('erisjs-utils')

module.exports = new Command('ping',{
  category : 'Owner', help : 'Parche actual de dota', args : '',
  ownerOnly : true, hide : true},
  function(msg, args, command){
    // let self = this
    const date = new Date().getTime()
    msg.reply(`Ping: ${date - msg.timestamp} ms`).then((m) => {setTimeout(() => {m.delete()},5000)})
  })
