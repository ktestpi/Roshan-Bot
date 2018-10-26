const { Command } = require('aghanim')
const basic = require('../../../helpers/basic')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('teams',{
  category : 'Diretide', help : 'See teams status', args : ''},
  function(msg, args, command){
    const game = command.game
    const teams = game.cache.teams.getall()

    return game.reply(msg,game.status.embed({
      // author :  {name : `${msg.author.username}'s bag`, icon_url : msg.author.avatarURL},
      title : 'Teams status',
      fields : teams.map(team => teamInfo(team,game.actions.secondsToHms,game.actions.nowToTimestamp,{candies : game.config.emojis.candies, protect : game.config.emojis.protect})),
      footer : {text : `Diretide`}
    }))
  })


function teamInfo(team,toReadTime,now,emojis){
  return {name : team._id, value : `${emojis.candies}: ${team.candies}\n${emojis.protect}: ${toReadTime(team.ts.steal - now())}`,inline : true}
}
