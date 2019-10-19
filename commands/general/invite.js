module.exports = {
  name: 'invite',
  category: 'General',
  help: 'Invita a Roshan a tu servidor',
  args: '',
  run: async function(msg, args, client, command){
    return msg.reply('invite.text')
  }
}
