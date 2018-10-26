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
      this.emit('guildCreate',msg.channel.guild)

  })
