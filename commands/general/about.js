const { Command } = require('aghanim')
const { Markdown } = require('erisjs-utils')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'about.title',
  description: 'about.description',
  fields: [
    {name: 'about.invite', value: 'about.invitation', inline: false},
    { name: 'about.devserver', value: 'about.invitedevserver', inline: false},
    { name: 'global.patreon', value: 'about.support', inline: false}
  ],
  footer : {text : 'about.footer'}
})

module.exports = new Command('about',{
  category : 'General', help : 'Información sobre el bot', args : ''},
  async function(msg, args, client){
    return msg.reply(embed)
  })
