const { Command } = require('aghanim')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('defense',{
  category : 'Diretide', help : 'Add protection time to your team basket', args : '', cooldown : 3600*4,
  cooldownMessage : function(msg,args,command,cooldown){return `${command.game.actions.secondsToHms(cooldown)} remaining`}},
  function(msg, args, command){
    const game = command.game
    const user = game.actions.getCacheUserFromMsg(msg)
    if(!user){return game.actions.retryCommandWithError(this,msg,args,command)}
    const team = game.cache.teams.get(user.team)
    if(!game.actions.reqUserCheck(user,game.config.setup.defense.require)){game.reply(msg,game.actions.reqUserShow(game.config.setup.defense.require));return command.error()} //show requirements

    const calc = game.actions.calcReqRew(user,game.config.setup.defense.require,game.config.setup.defense.rewards)

    return Promise.all([
      game.cache.users.save(user._id,calc.total),
      game.cache.teams.save(user.team,{ stats : {defense : team.stats.defense + 1}, ts : { steal : game.actions.nowToTimestamp(game.config.setup.defense.ts.team)}})
    ]).then((data) => {
      const embed = game.actions.userEmbed(user,{
        description : `${game.config.setup.defense.emoji} **${msg.author.username}** protected ${user.team} basket. ${game.actions.showRewards(calc.rewards)}`})
      return Promise.all([
        game.reply(msg,embed),
        game.log(embed)
      ])
    })
  })
