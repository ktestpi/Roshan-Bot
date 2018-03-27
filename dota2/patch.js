const { Command } = require('aghanim')
// const opendota = require('../helpers/opendota')
// const basic = require('../helpers/basic')
// const lang = require('../lang.json')
// const util = require('erisjs-utils')

module.exports = new Command('patch',{
  category : 'Dota 2', help : 'Parche actual de dota', args : ''},
  function(msg, args, command){
    // let self = this
    this.db.child('bot/patch').once('value').then(snap => msg.reply(snap.val()))
  })
