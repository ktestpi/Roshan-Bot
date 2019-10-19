module.exports = {
  name: ['discord','foso','devserver'],
  category: 'General', help : 'Invitación al Discord de desarrollo de Roshan', args : '',
  run: async function (msg, args, client, command){
    return msg.reply('discord.devserverinvite')
  }
}
