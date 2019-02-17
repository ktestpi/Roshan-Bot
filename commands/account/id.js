const { Command } = require('aghanim')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'id.title',
  fields: [{ name: 'id.info', value : '<_social_links>', inline : true}],
  thumbnail: { url: '<_user_avatar>' }
})

module.exports = new Command('id',{
  category : 'Account', help : 'Enlaces a Dotabuff, Steam, Twitch y Twitter', args : '[mención]'},
  async function(msg, args, client){
    return client.components.Account.existsAny(msg)
      .then(account => {
        // if (player.data._id !== msg.author.id) { return command.error() }
        const user = msg.channel.type === 0 ? msg.channel.guild.members.get(account._id) : msg.author
        return msg.reply(embed,{
          username : user.username,
          _social_links: client.components.Account.socialLinks(account, 'vertical', 'embed+link'),
          _user_avatar: user.avatarURL
        })
      })
  })
