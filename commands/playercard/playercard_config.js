const { Command } = require('aghanim')
const enumHeroes = require('../../enums/heroes')
const enumPlayerPos = require('../../enums/player_positions')
const enumPlayerCardBg = require('../../enums/card_bg')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'playercard.title',
  fields: [
    { name: 'playercard.highlightsheroes', value: '<_heroes>', inline: false},
    { name: 'game.position', value: '<_position>', inline: false},
    { name: 'playercard.bg', value: '<_bg>', inline: false}
  ],
  footer: { text: 'playercard.roshancard',  icon_url: '<bot_avatar>'}
})

module.exports = new Command('config',{
  subcommandFrom : 'playercard',
  category : 'Account', help : 'Configura la tarjeta de jugador@', args : ''},
  async function(msg, args, client, command){
    return client.components.Account.exists(msg.author.id)
      // .then(player => Promise.all([player,client.components.Opendota.player(player.data.profile.dota)]))
      .then(player => {
        if(player._id !== msg.author.id){return command.error()}
        let heroes = player.card.heroes.split(',')
        if (args.length > 2) {
          let _heroes = [], _pos = []
          for (var i = 1; i < args.length; i++) {
            if (args[i].startsWith('.')) {
              const hero = enumHeroes.getKeyByAlias(args[i].slice(1))
              if (hero) { _heroes.push(hero) }
            } else if (args[i].startsWith('-') && !_pos.length) {
              const position = enumPlayerPos.getValue(args[i].slice(1))
              if (position) { _pos.push(args[i].slice(1)) }
            }
          }
          if (_heroes.length > 0 && _heroes.length < 3) { return msg.reply('playercard.error.req3heroes') } //TODO langstring
          let counter = 0
          do {
            if (_heroes[counter]) { heroes[counter] = _heroes[counter] }
            counter++
          } while (counter < 3)
          let update = {}
          if (_heroes.length) { update.heroes = _heroes.join(',') }
          if (_pos.length) { update.pos = _pos.join(',') }
          if (!Object.keys(update).length) { return }
          return client.cache.profiles.save(msg.author.id, { card: update }).then(() => msg.addReaction(client.config.emojis.default.accept))
        } else {
          return msg.reply(embed, {
            username: msg.author.username,
            social_links: client.components.Account.socialLinks(player),
            _player_avatar: msg.author.avatarURL,
            _heroes: `\`\`\`${player.card.heroes ? heroes.map(h => enumHeroes.getValue(h).localized_name).join(', ') : args.locale('playercard.error.noheroesconfig', { cmd: 'r!cardhelp' })}\`\`\``,
            _position: `\`\`\`${enumPlayerPos.getValue(player.card.pos)}\`\`\``,
            _bg: `\`\`\`${enumPlayerCardBg.getValue(player.card.bg)}\`\`\``
          })
          // return msg.reply({
          //   embed: {
          //     title: args.user.locale('playerCard', { username: msg.author.username }),
          //     thumbnail: { url: msg.author.avatarURL, width: 40, height: 40 },
          //     fields: [
          //       { name: args.user.langstring('highlightsHeroes'), value: `\`\`\`${player.card.heroes ? heroes.map(h => enumHeroes.getValue(h).localized_name).join(', ') : args.locale('errorCardNoHeroesConfig', { cmd: 'r!cardhelp' })}\`\`\``, inline: false },
          //       { name: args.user.langstring('position'), value: `\`\`\`${enumPlayerPos.getValue(player.card.pos)}\`\`\``, inline: false },
          //       { name: args.user.langstring('playerCardBg'), value: `\`\`\`${enumPlayerCardBg.getValue(player.card.bg)}\`\`\``, inline: false }
          //     ],
          //     footer: { text: args.user.langstring('roshanCard'), icon_url: client.user.avatarURL },
          //     color: client.config.color
          //   }
          // })
        }
      })
  })
