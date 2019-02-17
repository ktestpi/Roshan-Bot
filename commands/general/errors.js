const { Command } = require('aghanim')
const message = require('../../containers/messages.json').errors
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'errors.title',
  fields: [
    { name: 'errors.field0.name', value: 'errors.field0.value', inline: false },
    { name: 'errors.field1.name', value: 'errors.field1.value', inline: false }
  ],
  thumbnail: { text: 'about.footer', icon_url: '<link_patreon>' }
})

module.exports = new Command('errors',{
  category : 'General', help : 'Corrección de errores', args : ''},
  async function(msg, args, client){
    return msg.reply(embed)
  })
