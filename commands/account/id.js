const { Command } = require('aghanim')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'id.title',
  fields: [{ name: 'id.info', value : '<_social_links>', inline : true}],
  thumbnail: { url: '<user_avatar>' }
})

module.exports = new Command('id',{
  category : 'Account', help : 'Enlaces a Dotabuff, Steam, Twitch y Twitter', args : '[mención]'},
  async function(msg, args, client, command){
    return client.components.Account.existsAny(msg)
      .then(account => {
        return msg.reply(embed,{
          _social_links: client.components.Account.socialLinks(account, 'vertical', 'embed+link')
        }, account._id)
      })
  })
