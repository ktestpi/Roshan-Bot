const { Command } = require('aghanim')
// const message = require('../../containers/messages.json').thanks
const EmbedBuilder = require('../../classes/embed-builder.js')
const embed = new EmbedBuilder({
  title : 'thanks.title',
  fields:[
    {name: 'thanks.fields0.name', value: '<_betatesters>', inline : false},
    {name: 'thanks.fields1.name', value: '<_complements>', inline : false}
  ]
})
module.exports = new Command('thanks',{
  category : 'General', help : 'Agradecimientos', args : ''},
  async function(msg, args, client){
    return msg.reply({
      _betatesters: client.config.others.betatesters.join(', '),
      _complements: client.config.others.complements.map(c => `${c.tag}: ${c.author}`).join('\n')
    })
  })
