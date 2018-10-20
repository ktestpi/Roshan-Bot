const { Command } = require('aghanim')
const opendota = require('../../helpers/opendota')
const basic = require('../../helpers/basic')
const { Markdown } = require('erisjs-utils')

module.exports = new Command('new',{
  category : 'General', help : 'Última update', args : ''},
  function(msg, args, command){
    return msg.reply(this._lastUpdateText)
  })