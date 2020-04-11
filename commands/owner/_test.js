const util = require('erisjs-utils')

module.exports = {
  name: 'tes',
  category : 'Owner',
  help : 'Testing',
  args : '',
  hide : true,
  requirements: ['owner.only'],
  run: async function(msg, args, client){
    // return msg.reply('<bot_name> es el bot. <roshan> <flag>', {flag: 'esta es la flag'})
    // client.emit('aghanim:error', new Error('HOLA'), client)
    // throw new Error('dasdsa')
    return msg.reply({embed : {
      title: '<bot_name> es el bot. <roshan> <flag>',
      description: '<author_name> es el autor',
      fields: [{name: '<bot_name>', value: '<bot_name>', inline: false}],
    }}, {flag: 'esta es la flag'})
  }
}
