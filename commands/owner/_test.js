const { Command } = require('aghanim')
const util = require('erisjs-utils')
const enumHeroes = require('../../enums/heroes')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')

module.exports = new Command('tes',{
  category : 'Owner', help : 'Testing', args : '', cooldownMessage :'Quedan **<cd>**s',
  ownerOnly : true, hide : true},
  function(msg, args, command){
    console.log(msg.constructor.prototype)
    throw new Error('artifact')
  })
