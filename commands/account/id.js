const { Command } = require('aghanim')

module.exports = new Command('id',{
  category : 'Account', help : 'Enlaces a Dotabuff, Steam, Twitch y Twitter', args : '[mención]'},
  async function(msg, args, client, command){
    return client.components.Account.existsAny(msg)
      .then(account => 
        msg.reply({
          embed: {
            title: 'id.title',
            fields: [{ name: 'id.info', value: '<_social_links>', inline: true }],
            thumbnail: { url: '<user_avatar>' }
          }}, {
            _social_links: client.components.Account.socialLinks(account, 'vertical', 'embed+link')
          }, account._id)
      )
  })
