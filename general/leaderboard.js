const { Command } = require('aghanim')
// const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
// const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('leaderboard',{
  category : 'Dota 2', help : 'Tabla de líderes de Roshan', args : ''},
  function(msg, args, command){
    msg.reply(this.replace.do(lang.leaderboard,{link : this.config.links.web_leaderboard}))
  })
