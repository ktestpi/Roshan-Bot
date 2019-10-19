module.exports = {
  name: 'svowmsg',
  category : 'Owner',
  help : 'Mensage a propietario del servidor',
  args : '<guildID>',
  requirements: ['owner.only'],
  run: async function(msg, args, command){
    if(!args[1]){return msg.replyLocale('errorNoServerID')}
    const id = args[1];
    const guild = client.guilds.get(id);
    if(!guild){return msg.replyLocale('errorGuildNotFound')}
    const owner = guild.members.get(guild.ownerID);
    const message = args.from(2)
    const embed = {
      author : {name : `Guild owner message: ${guild.name}`, icon_url : guild.iconURL},
      // title : message.reason,
      description : message,
      // thumbnail : {url : owner.avatarURL, height : 40, width : 40},
      footer : {text : client.user.username ,icon_url : client.user.avatarURL},
      color : client.config.colors.sendMsg.owner
    }
    owner.user.getDMChannel().then(channel => {
      channel.createMessage({embed}).then(() => client.createMessage(client.config.guild.notifications,{embed}))
      // courier.send('log',{info : `${owner.username} | ${guild.name} | ${guild.id}`, info_icon : guild.iconURL, reason : `Propietario servidor`, message : message, color : config.colors.sendMsg.owner},{bot})
    })
  }
}
