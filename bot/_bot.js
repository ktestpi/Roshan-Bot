const { Command } = require('aghanim')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('bot',{
  category : 'Owner', help : 'Comando de control del bot', args : '<cmd>',
  ownerOnly : true},
  function(msg, args, command){
    // let self = this
  })
