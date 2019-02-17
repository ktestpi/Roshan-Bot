const { Command } = require('aghanim')
const util = require('erisjs-utils')
const enumHeroes = require('../../enums/heroes')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')
const { doIfCondition } = require('../../helpers/functional.js')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title : 'rollMessage',
  description : 'rollMessage'
})

module.exports = new Command('tes',{
  category : 'Owner', help : 'Testing', args : '', cooldownMessage :'Quedan **<cd>**s',
  ownerOnly : true, hide : true,
  check: function (msg, args, client) {
    return true
  }},
  async function(msg, args, client){
    // msg.reply(msg.author.account)
    console.log('HI')
    console.log(client.locale.replacer('%%nameServer%% dsadsadas %%discord%%'))
    // console.log(args.locale('<bot_name> ssdas'))
    // return doIfCondition(this.components.Users.isSupporter(msg.author.id), () => msg.reply('DoIF True')
    //     ).then(message => msg.reply('Secure after DoIF'))
  })
