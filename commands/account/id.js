const { Command } = require('aghanim')
const basic = require('../../helpers/basic')

module.exports = new Command('id',{
  category : 'Account', help : 'Enlaces a Dotabuff, Steam, Twitch y Twitter', args : '[mención]'},
  function(msg, args, command){
    // let self = this
    return this.plugins.Opendota.userID(msg, args)
      .then(player => {
        // if (player.data._id !== msg.author.id) { return command.error() }
        const lang = this.locale.getUserStrings(msg)
        let user = msg.channel.type === 0 ? msg.channel.guild.members.get(player.discordID) : msg.author
        return msg.reply({
          embed: {
            title: this.locale.replacer(lang.userInfoTitle, { username: user.username }),
            fields: [
              {
                name: lang.userInfoIDTitle,
                value: basic.socialLinks(player.data.profile, 'vertical', this.config.links.profile),//socialLinks(config.links.profile,snap.val().profile,'verticalIDMinL'),
                inline: true
              }],
            thumbnail: { url: user.avatarURL, height: 40, width: 40 },
            color: this.config.color
          }
        })
      })
  })
