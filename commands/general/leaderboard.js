module.exports = {
  name: 'leaderboard',
  category: 'Dota 2',
  help: 'Tabla de líderes de Roshan',
  args: '',
  run: async function (msg, args, client, command){
    return msg.reply('leaderboard.text')
  }
}
