const { Command } = require('aghanim')
const basic = require('../../../helpers/basic')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('joindiretide',{
  category : 'Diretide', help : 'Join to Diretide (reset profile and enter a new Team)', args : ''},
  function(msg, args, command){
    const game = command.game
    return game.actions.newUser(msg.author.id).then(user => game.log(game.actions.userEmbed(user,{ description : `**${msg.author.username}** joined to ${user.team} team`}))).then(data => msg.addReactionSuccess)
  })
