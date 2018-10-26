const { Command } = require('aghanim')
const basic = require('../../../helpers/basic')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('send',{
  category : 'Diretide', help : 'Send candies to your team basket', args : '<candies>', cooldown : 3600*6,
  cooldownMessage : function(msg,args,command,cooldown){return `${command.game.actions.secondsToHms(cooldown)} remaining`}},
  function(msg, args, command){
    const game = command.game
    const user = game.actions.getCacheUserFromMsg(msg)
    if(!user){return game.actions.retryCommand(this,msg,args,command)}
    const team = game.cache.teams.get(user.team)

    const candies = parseInt(args[1])
    if(isNaN(candies)){game.reply(msg,`Write a correct number of candies to send.`);return command.error()}
    if(candies > user.candies){game.reply(msg,`You don't have candies enough`);return command.error()}

    const updateUser = {candies : user.candies - candies, xp : user.xp + game.config.setup.send.rewards.xp, stats : {send : user.stats.send + candies}}
    return Promise.all([
      game.cache.users.save(user._id,updateUser),
      game.cache.teams.save(team._id,{candies : team.candies + candies, stats : {send : team.stats.send + candies}})
    ]).then(() => {
      const embed = game.actions.userEmbed(user,{
        description : `${game.config.setup.send.emoji} **${msg.author.username}** sent **${candies}** candies to **${team._id}** team`})
      return Promise.all([
        game.reply(msg,embed),
        game.log(embed)
      ])
    })
  })
