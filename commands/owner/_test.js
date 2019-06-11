const { Command } = require('aghanim')
const util = require('erisjs-utils')
const enumHeroes = require('../../enums/heroes')
const { UserError, ConsoleError } = require('../../classes/errors.js')
const { doIfCondition } = require('../../helpers/functional.js')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: '%%nameserver%% <username> hola',
  description: '%%steam.playerinfo%% hola'
})

module.exports = new Command('tes',{
  category : 'Owner', help : 'Testing', args : '', cooldownMessage :'Quedan **<cd>**s',
  ownerOnly : true, hide : true,
  check: function (msg, args, client) {
    return true
  }},
  async function(msg, args, client){
    return msg.reply(embed, {flag: 'esta es la flag'})
  })
