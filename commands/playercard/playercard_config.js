const enumHeroes = require('../../enums/heroes')
const enumPlayerPos = require('../../enums/player_positions')
const enumPlayerCardBg = require('../../enums/card_bg')

module.exports = {
  name: 'config',
  childOf: 'playercard',
  category: 'Account', 
  help: 'Configura la tarjeta de jugador@', 
  args: '',
  requirements: [
    'account.exist'
  ],
  run: async function(msg, args, client, command){
    if(args.account._id !== msg.author.id){return command.error()}
      let heroes = args.account.card.heroes.split(',')
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
        if (_heroes.length > 0 && _heroes.length < 3) { return msg.reply('playercard.error.req3heroes') }
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
        return msg.reply({
          embed: {
            title: 'playercard.title',
            description: '<social_links>',
            fields: [
              { name: 'playercard.highlightsheroes', value: '<_heroes>', inline: false},
              { name: 'game.position', value: '<_position>', inline: false},
              { name: 'playercard.bg', value: '<_bg>', inline: false}
            ],
            footer: { text: 'playercard.roshancard',  icon_url: '<bot_avatar>'}
          }
        }, {
          username: msg.author.username,
          social_links: client.components.Account.socialLinks(args.account),
          _player_avatar: msg.author.avatarURL,
          _heroes: `\`\`\`${args.account.card.heroes ? heroes.map(h => enumHeroes.getValue(h).localized_name).join(', ') : msg.author.locale('playercard.error.noheroesconfig', { cmd: 'r!cardhelp' })}\`\`\``,
          _position: `\`\`\`${enumPlayerPos.getValue(args.account.card.pos)}\`\`\``,
          _bg: `\`\`\`${enumPlayerCardBg.getValue(args.account.card.bg)}\`\`\``
        })
      }
    }
}
