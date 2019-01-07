const { Command } = require('aghanim')
const util = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')
const enumHeroes = require('../../enums/heroes')
const enumLobbyType = require('../../enums/lobby')
const enumSkill = require('../../enums/skill')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')

module.exports = new Command(['match','m'],{
  category : 'Dota 2', help : 'Estadísticas de una partida', args : '<id>'},
  function(msg, args, command){
    if(!args[1]){return}
    msg.channel.sendTyping()
    return this.components.Opendota.match(args[1])
      .then(results => {
        if (results[0].error) { return }
        const lang = this.locale.getUserStrings(msg)
        if (results[0].game_mode === 19) { return msg.reply(lang.matchEventNoInfo) }
        
        const spacesBoard = ['19f', '8f', '8f', '6f', '5f', '4f', '17f'];
        let radiant = new util.Classes.Table([lang.hero, lang.kda, lang.gpmxpm, lang.lhd, lang.hdmg, lang.tdmg, lang.player], null, spacesBoard, { fill: '\u2002' });
        let dire = new util.Classes.Table([lang.hero, lang.kda, lang.gpmxpm, lang.lhd, lang.hdmg, lang.tdmg, lang.player], null, spacesBoard, { fill: '\u2002' });
        results[0].players.forEach((player, index) => {
          if (index < 5) {
            radiant.addRow([enumHeroes.getValue(player.hero_id).localized_name, player.kills + '/' + player.deaths + '/' + player.assists, player.gold_per_min + '/' + player.xp_per_min, player.last_hits + '/' + player.denies, util.Number.tok(player.hero_damage) + lang.k, util.Number.tok(player.tower_damage) + lang.k, player.name ? this.components.Bot.parseText(player.name, 'nf') : this.components.Bot.parseText(player.personaname || lang.unknown, 'nf')]);
          } else {
            dire.addRow([enumHeroes.getValue(player.hero_id).localized_name, player.kills + '/' + player.deaths + '/' + player.assists, player.gold_per_min + '/' + player.xp_per_min, player.last_hits + '/' + player.denies, util.Number.tok(player.hero_damage) + lang.k, util.Number.tok(player.tower_damage) + lang.k,
            player.name ? this.components.Bot.parseText(player.name, 'nf') : this.components.Bot.parseText(player.personaname || lang.unknown, 'nf')]);
          }  
        })

        return msg.reply({
          embed: {
            title: this.locale.replacer(lang.matchTitle, { victory: lang.victory, team: odutil.winnerTeam(results[0])}),
            description: (results[0].league ? ' :trophy: ' + results[0].league.name : enumLobbyType.getValue(results[0].lobby_type) + ' ' + (enumSkill.getValue(results[0].skill) || '')) + ' `' + lang.matchID + ': ' + results[0].match_id + '` ' + util.Markdown.link(this.config.links.profile.dotabuff.slice(0, -8) + 'matches/' + results[0].match_id, lang.moreInfo) + '\n' + this.locale.replacer(lang.matchTime, { duration: odutil.durationTime(results[0].duration), time: util.Date.custom(results[0].start_time * 1000, 'h:m D/M/Y') }),
            fields: [
              {
                name: (results[0].radiant_team ? results[0].radiant_team.name : lang.radiant) + ' - ' + results[0].radiant_score,
                value: radiant.render(),
                inline: false
              },
              {
                name: (results[0].dire_team ? results[0].dire_team.name : lang.dire) + ' - ' + results[0].dire_score,
                value: dire.render(),
                inline: false
              },
            ],
            color: this.config.color
          }
        })
      }).catch(err => { throw new UserError('opendota', 'errorOpendotaRequest', err) })
  })
