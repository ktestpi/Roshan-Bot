module.exports = {
  name: ['donate', 'patreon', 'kofi'],
  category: 'General', help : '❤ Dona para apoyar el bot', args : '',
  run: async function(msg, args, client, command){
    return msg.reply('donate.text')
  }
}
