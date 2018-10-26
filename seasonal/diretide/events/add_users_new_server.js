const { Event } = require('aghanim')

module.exports = new Event('diretide_new_server','guildCreate',{}, function(guild){ // guild
  const game = this.games.diretide
  let teams = game.cache.users.getall().reduce((teams,user) => {
    teams[user.team]++
    return teams
  },{blue : 0, green : 0, red : 0, yellow : 0})
  const teamsOrder = Object.keys(teams).map(key => ({_id : key, size : teams[key]})).sort((a,b) => a.size - b.size)
  console.log(teamsOrder);
  Promise.all(guild.members.filter(member => {
    return !member.bot && !game.cache.users.has(member.id)
  }).map((member,index) => game.actions.resetUser(member.id,teamsOrder[index%4]._id).then(user =>
    game.log(game.actions.userEmbed(user,{ description : `**${member.username}** joined to ${teamsOrder[team]._id} team`})))))
  .then((results) => game.log(game.status.embed({
      title : 'New server',
      description : `${results.length} users joined to Diretide`
    })
  ))
})
