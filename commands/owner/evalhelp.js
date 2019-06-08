const { Command } = require('aghanim')

const variables = [
  {id : 'bot', desc : 'Bot'},
  {id : '_guild', desc : 'Servidor actual'},
  {id : '_channel', desc : 'Canal actual'},
  {id : '_user', desc : 'Autor mensaje'}
]

module.exports = new Command(['evalhelp','eh'],{
  category : 'Owner', help : '', args : '', hide : true,
  ownerOnly : true},
  async function(msg, args, client){
    // let self = this
    return msg.reply({embed : {
      title : 'Eval - Ayuda',
      fields : [{name : 'Variables', value : variables.map(v => `**${v.id}** - ${v.desc}`).join('\n'), inline : false}],
      color : client.config.color
    }})
  })
