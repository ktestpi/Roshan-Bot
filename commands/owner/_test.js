const { Command } = require('aghanim')
const util = require('erisjs-utils')
const enumHeroes = require('../../enums/heroes')
const { UserError, ConsoleError } = require('../../classes/errors.js')
const { doIfCondition } = require('../../helpers/functional.js')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: '%%nameServer%% hola',
  description: '%%steam.playerinfo%% hola'
})

module.exports = new Command('tes',{
  category : 'Owner', help : 'Testing', args : '', cooldownMessage :'Quedan **<cd>**s',
  ownerOnly : true, hide : true,
  check: function (msg, args, client) {
    return true
  }},
  async function(msg, args, client){
    // msg.reply(msg.author.account)
    // throw new ConsoleError('Console', 'error.unknown')
    console.log('HI')
    console.log(client.locale.replacer('%%nameServer%% dsadsadas %%discord%%'))
    return msg.reply(embed, {flag: 'esta es la flag'})
    
    // console.log(args.locale('<bot_name> ssdas'))
    // return doIfCondition(this.components.Users.isSupporter(msg.author.id), () => msg.reply('DoIF True')
    //     ).then(message => msg.reply('Secure after DoIF'))
  })
