const { Command } = require('aghanim')

module.exports = new Command('giveaway',{
  category : 'General', help : 'Realiza un sorteo en Discord', args : '[rol]',
  rolesCanUse: 'aegis'},
  function(msg, args, command){
    const guild = msg.channel.guild
    const re = /<@&([\d^>]+)>/g
    let myArray
    const roles = []
    let members = new Set()
    if(re.test(msg.content)){
      re.lastIndex = 0
      while(myArray = re.exec(msg.content)){
        const membersFound = guild.members.filter(m => m.roles.includes(myArray[1]) && !m.bot)
        roles.push(myArray[1])
        if(membersFound.length){membersFound.forEach(m => members.add(m.id))}
      }
      if(members.size){
        members = Array.from(members)
        fn(msg,members,guild,roles,this)
      }
    }else{
      members = guild.members.map(m => m.id)
      fn(msg,members,guild,roles,this)
    }
  })

function fn(msg,members,guild,roles,bot){
  const winner = guild.members.get(members[Math.floor(Math.random()*members.length)])
  const lang = bot.locale.getUserStrings(msg)
  const title = bot.locale.replacer(lang.giveawayTitle,{members : members.length})
  const waittime = 2*1000
  roles = roles.map(r => guild.roles.get(r).name)
  const embed = {
    content : '',
    embed : {
      title : `${title}`,
      description : bot.locale.replacer(lang.giveawayWinner,{winner : winner.username}),
      thumbnail : {url : winner.avatarURL},
      footer : {text : 'Giveaway'},
      color : bot.config.color
    }
  }
  if(roles.length){embed.embed.fields = [{name : 'Roles', value : roles.join(', '), inline : false}]}
  msg.reply(`${title}...${roles.length ? `\nRoles: ${roles.join(', ')}` : ''}`)
    .then(m => setTimeout(() => m.edit(embed)
      ,waittime))
}
