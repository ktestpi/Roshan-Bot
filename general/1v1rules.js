const { Command } = require('aghanim')
// const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
// const util = require('erisjs-utils')
// const lang = require('../lang.json')
const messages = require('../containers/messages.json')
const rules = {}
rules['1v1rules'] = messages['1v1rules']
rules['1v1rules nr'] = messages['1v1rules nr']

module.exports = new Command('1v1rules',{
  category : 'General', help : 'Agradecimientos', args : ''},
  function(msg, args, command){
    let self = this
    let query = args[0]
    if(args[1]){query += ' ' + args[1]}
    if(!rules[query]){return basic.wrongCmd(msg,rules,args.until(1))}
    msg.reply(rules[query])
  })
