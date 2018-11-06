const { Command } = require('aghanim')
const opendota = require('../../helpers/opendota')
const basic = require('../../helpers/basic')
const util = require('erisjs-utils')
const enumHeroes = require('../../enums/heroes')

module.exports = new Command('tes',{
  category : 'Owner', help : 'Testing', args : '', cooldownMessage :'Quedan **<cd>**s',
  ownerOnly : true, hide : true},
  function(msg, args, command){
      // return util.Request.getJSON('https://raw.githubusercontent.com/ottah/ArtifactDB/master/cards-manifest.json')
      //   .then(result => {console.log(result);return msg.reply(result)} )
      // this.emit('guildCreate',msg.channel.guild)
      // return this.od.userCall(msg,args)
      //   .then(playerID => this.od.player(playerID))
      //   .then(results => console.log(results))
    msg.replyULDM('IE_CardCreate',{username : 'Desvelao'})

    msg.replyCLDM({
      embed : {
        title: 'giveawayTitle',
        description: 'giveawayTitle',
        fields: [{ name: 'giveawayWinner', value: 'giveawayWinner', inline: true }, { name: 'Ganador 2', value: 'giveawayWinner', inline: true }]
      }
    }, { username: 'Desvelao', members: 1, winner : 'Desve'})

  })
