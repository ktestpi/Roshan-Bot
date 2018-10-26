const { Command } = require('aghanim')
const { Classes } = require('erisjs-utils')

module.exports = new Command('direranking',{
  category : 'Diretide', help : '', args : '', ownerOnly : true},
  function(msg, args, command){
    const game = command.game
    const users = command.game.cache.users.getall().sort((a,b) => {
      return network(a) - network(b)
    })
    const table = new Classes.Table(['Pos', 'Player', 'Net', 'Team'],null, ['3','15','8r','6'], {fill: '\u2002'});
    const description = users.splice(0,10).forEach((user,index) => {
      const username = this.users.get(user._id) ?  this.users.get(user._id).username : user._id
      table.addRow([index+1,username,network(user),user.team])
    })
    return game.reply(msg,game.status.embed({
      title : 'Ranking',
      description : table.render()
    }))
  })


function network(user){
  return Object.keys(user.stats).reduce((total,stat) => total += user.stats[stat],0)
}
