module.exports = {
    name: 'updates',
    category: 'DevServer',
    help: '',
    args: '',
    enable: false,
    requirements: ['pit.user'],
    run: async function (msg, args, client, command){
        const member = msg.channel.guild.members.find(member => member.id === msg.author.id)
        const roleUpdates = msg.channel.guild.roles.find(r => r.name === client.config.roles.pit_updates)
        if(member.roles.includes(roleUpdates.id)){
            await member.removeRole(roleUpdates.id)
            return msg.addReactionSuccess()
        }else{
            await member.addRole(roleUpdates.id)
            return msg.addReactionSuccess()
        }
    }
  }