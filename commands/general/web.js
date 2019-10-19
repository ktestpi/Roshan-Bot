module.exports = {
  name: 'web',
  category: 'General',
  help: 'RoshanApp',
  args: '',
  run: async function(msg, args, client, command){
    return msg.reply('web.text')
  }
}
