const { Command } = require('aghanim')
const basic = require('../../../helpers/basic')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('steal',{
  category : 'Diretide', help : 'Steal candies from enemy team baskets', args : '<team tag>', cooldown : 3600*4,
  cooldownMessage : function(msg,args,command,cooldown){return `${command.game.actions.secondsToHms(cooldown)} remaining`}},
  function(msg, args, command){
    const game = command.game
    const user = game.actions.getCacheUserFromMsg(msg)
    if(!user){return game.actions.retryCommand(this,msg,args,command)}//Save profile
    const team = game.actions.getCacheTeamMentioned(args,1)
    if(!team){msg.reply(`Write a tag team correct. ${Object.keys(game.config.teams).map(t => `${t}`).join(', ')}`);return command.error()}

    if(!game.actions.reqUserCheck(user,game.config.setup.steal.require)){game.reply(msg,game.actions.reqUserShow(game.config.setup.steal.require));return command.error()} //show requirements
    if(game.actions.reqUserActiveOwnTeam(user,team)){msg.reply('You can\'t steal own team basket');return command.error()}
    const ts = game.actions.reqCheckTime(team.ts.steal)
    if(ts < 0){game.reply(msg,`${team._id} team basket is protected: ${ts} seconds remaining`);return command.error()}

    const candies = game.actions.intervalRandomNumberLimited(game.config.setup.steal.rewards.candies)
    if(candies === 0){game.reply(msg,`${team._id} team basket is empty`);return command.error()}

    const updateUser = {candies : user.candies + candies, essence : user.essence - game.config.setup.steal.require.essence, xp : user.xp + 1, stats : {steal : user.stats.steal + candies}}
    return Promise.all([
      game.cache.users.save(user._id,updateUser),
      game.cache.teams.save(team._id,{candies : team.candies - candies, stats : {steal : team.stats.steal + candies}, ts : {steal : game.actions.nowToTimestamp(game.config.setup.steal.ts.team)}})
    ]).then(() => {
      const embed = game.actions.userEmbed(user,{
        description : `${game.config.setup.steal.emoji} **${msg.author.username}** stole **${candies}** candies from **${team._id}** team`})
      return Promise.all([
        game.reply(msg,embed),
        game.log(embed)
      ])
    })
  })
