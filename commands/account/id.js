module.exports = {
  name: 'id',
  category : 'Account',
  help : 'Enlaces a Dotabuff, Steam, Twitch y Twitter',
  args : '[mención]',
  requirements: ['account.existany'],
  run: async function(msg, args, client, command){
    return msg.reply({
      embed: {
        title: 'id.title',
        fields: [{ name: 'id.info', value: '<_social_links>', inline: true }],
        thumbnail: { url: '<user_avatar>' }
      }}, {
        _social_links: client.components.Account.socialLinks(args.account, 'vertical', 'embed+link')
      }, args.account._id)
  }
}
