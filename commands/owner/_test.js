const { Command } = require('aghanim')
const util = require('erisjs-utils')
const enumHeroes = require('../../enums/heroes')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')

module.exports = new Command('tes',{
  category : 'Owner', help : 'Testing', args : '', cooldownMessage :'Quedan **<cd>**s',
  ownerOnly : true, hide : true},
  function(msg, args, command){
    // return util.Request.getJSON('https://raw.githubusercontent.com/ottah/ArtifactDB/master/cards-manifest.json')
    //   .then(result => {console.log(result);return msg.reply(result)} )
    // this.emit('guildCreate',msg.channel.guild)
    // return this.plugins.Opendota.userCall(msg,args)
    //   .then(playerID => this.plugins.Opendota.player(playerID))
    //   .then(results => console.log(results))
    // return Promise.resolve('10').then(() => {throw new Error('Tes Error');return Promise.resolve(20)})
    // return Promise.reject(new UserError('opendota',{msg}))
    // return Promise.resolve(() => {
    //   return new Error('error in TES')
    // })
    // throw new Error('Holaaaaa')
    throw new ConsoleError('opendota','errorOpendotaRequest', new Error('Hola'))
    // return Promise.reject(new Error('blbablaslasa'))
    // throw new Error(`Error creating config for **${msg.author.username}** (${msg.author.id})`)
    // setTimeout(() => { throw }, 2000)
    
    // this.errorManager.emit(new ConsoleError('guildsaving', `Error creating config for **${msg.author.username}** (${msg.author.id})`))
    // msg.replyCLDM({
    //   embed : {
    //     title: 'giveawayTitle',
    //     description: 'giveawayTitle',
    //     fields: [{ name: 'giveawayWinner', value: 'giveawayWinner', inline: true }, { name: 'Ganador 2', value: 'giveawayWinner', inline: true }]
    //   }
    // }, { username: 'Desvelao', members: 1, winner : 'Desve'})

  })
