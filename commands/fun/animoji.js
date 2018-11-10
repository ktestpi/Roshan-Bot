const { Command } = require('aghanim')
const basic = require('../../helpers/basic')
const links = require('../../containers/emojis.json')

module.exports = new Command('animoji',{
  category : 'Fun', help : 'Emojis animados de Dota 2', args : '<emoji>'},
  function(msg, args, command){
    return basic.sendImageStructure(msg,args[1],links,args.until(1))
  })
