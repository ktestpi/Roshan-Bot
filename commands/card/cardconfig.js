const { Command } = require('aghanim')
const enumHeroes = require('../../enums/heroes')
const enumPlayerPos = require('../../enums/player_positions')


module.exports = new Command('cardconfig',{
  category : 'Account', help : 'Configura la tarjeta de jugador@', args : ''},
  function(msg, args, command){
    return this.components.Account.exists(msg.author.id)
      // .then(player => Promise.all([player,this.components.Opendota.player(player.data.profile.dota)]))
      .then(player => {
        if(player._id !== msg.author.id){return command.error()}
        let heroes = player.card.heroes.split(',')
        const lang = this.locale.getUserStrings(msg)
        if (args.length > 1) {
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
          if (_heroes.length > 0 && _heroes.length < 3) { return msg.reply('Debes establecer 3 héroes') }
          let counter = 0
          do {
            if (_heroes[counter]) { heroes[counter] = _heroes[counter] }
            counter++
          } while (counter < 3)
          let update = {}
          if (_heroes.length) { update.heroes = _heroes.join(',') }
          if (_pos.length) { update.pos = _pos.join(',') }
          if (!Object.keys(update).length) { return }
          console.log('Update',update)
          return this.cache.profiles.save(msg.author.id, { card: update }).then(() => msg.addReaction(this.config.emojis.default.accept))
        } else {
          return msg.reply({
            embed: {
              title: this.locale.replacer(lang.playerCard, { username: msg.author.username }),
              thumbnail: { url: msg.author.avatarURL, width: 40, height: 40 },
              fields: [
                { name: lang.highlightsHeroes, value: `\`\`\`${player.card.heroes ? heroes.map(h => enumHeroes.getValue(h).localized_name).join(', ') : this.locale.replace('errorCardNoHeroesConfig', msg, { cmd: 'r!cardhelp' })}\`\`\``, inline: false },
                { name: lang.position, value: `\`\`\`${enumPlayerPos.getValue(player.card.pos)}\`\`\``, inline: false }
              ],
              footer: { text: lang.roshanCard, icon_url: this.user.avatarURL },
              color: this.config.color
            }
          })
        }
      })
  })
