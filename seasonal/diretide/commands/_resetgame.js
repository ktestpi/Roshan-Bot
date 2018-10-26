const { Command } = require('aghanim')
const basic = require('../../../helpers/basic')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('direresetgame',{
  category : 'Diretide', help : '', args : '', ownerOnly : true},
  function(msg, args, command){
    const game = command.game
    return game.actions.resetGame(this).then(() => msg.addReactionSuccess()).catch(err => console.log(err.stack))
    // const rewards = game.actions.getUserRewards(game.config.setup.steal.rewards)
    // game.actions.intervalRandomNumberLimited(game.config.setup.steal.random,team.candies)
  })
