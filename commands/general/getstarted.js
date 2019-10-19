module.exports = {
  name: 'getstarted',
  category: 'Server',
  help: 'Configuración de servidor',
  args: '',
  run: async function (msg, args, client, command){
    return msg.reply('getstarted.text')
  }
}
