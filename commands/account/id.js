const { Command } = require('aghanim')

module.exports = new Command('id',{
  category : 'Account', help : 'Enlaces a Dotabuff, Steam, Twitch y Twitter', args : '[mención]'},
  function(msg, args, command){
    // let self = this
    return this.components.Account.existsAny(msg)
      .then(account => {
        console.log(account)
        // if (player.data._id !== msg.author.id) { return command.error() }
        const lang = this.locale.getUserStrings(msg)
        let user = msg.channel.type === 0 ? msg.channel.guild.members.get(account._id) : msg.author
        return msg.reply({
          embed: {
            title: this.locale.replacer(lang.userInfoTitle, { username: user.username }),
            fields: [
              {
                name: lang.userInfoIDTitle,
                value: this.components.Account.socialLinks(account, 'vertical', 'embed+link'),
                inline: true
              }],
            thumbnail: { url: user.avatarURL, height: 40, width: 40 },
            color: this.config.color
          }
        })
      })
  })
