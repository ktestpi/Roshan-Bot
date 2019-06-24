const { Command } = require('aghanim')
const util = require('erisjs-utils')
const enumHeroes = require('../../enums/heroes')
const { UserError, ConsoleError } = require('../../classes/errors.js')
const { doIfCondition } = require('../../helpers/functional.js')

module.exports = new Command('tes',{
  category : 'Owner', help : 'Testing', args : '', cooldownMessage :'Quedan **<cd>**s',
  ownerOnly : true, hide : true,
  check: function (msg, args, client) {
    return true
  }},
  async function(msg, args, client){
    // return msg.reply('<bot_name> es el bot. <roshan> <flag>', {flag: 'esta es la flag'})
    return msg.reply({embed : {
      title: '<bot_name> es el bot. <roshan> <flag>',
      description: '<author_name> es el autor',
      fields: [{name: '<bot_name>', value: '<bot_name>', inline: false}],
    }}, {flag: 'esta es la flag'})
  })
