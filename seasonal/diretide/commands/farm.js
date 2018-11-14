const { Command } = require('aghanim')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('farm',{
  category : 'Diretide', help : 'Farm candies and essences', args : '', cooldown : 3600*4,
  cooldownMessage : function(msg,args,command,cooldown){return `${command.game.actions.secondsToHms(cooldown)} remaining`}},
  function(msg, args, command){
    const game = command.game
    const user = game.actions.getCacheUserFromMsg(msg)
    if(!user){return game.actions.retryCommand(this,msg,args,command)}

    const calc = game.actions.calcReqRew(user,game.config.setup.farm.require,game.config.setup.farm.rewards)
    calc.total.stats.farm += calc.rewards.candies
    // return console.log(calc);

    return Promise.all([
      game.cache.users.save(user._id,calc.total)
    ]).then((data) => {
      const embed = game.actions.userEmbed(user,{
        description : `${game.config.setup.farm.emoji} **${msg.author.username}** farmed ${game.actions.showRewards(calc.rewards)}.`})
      return Promise.all([
        game.reply(msg,embed),
        game.log(embed)
      ])
    })
  })
