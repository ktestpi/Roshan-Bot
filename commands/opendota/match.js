const { Command } = require('aghanim')
const util = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')
const enumHeroes = require('../../enums/heroes')
const enumLobbyType = require('../../enums/lobby')
const enumSkill = require('../../enums/skill')
const { UserError, ConsoleError } = require('../../classes/errors.js')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'match.title',
  description: 'match.description',
  fields: [
    {name : '<_match_field0_name>', value: '<_match_field0_value>', inline: false},
    {name : '<_match_field1_name>', value: '<_match_field1_value>', inline: false},
  ]
})

module.exports = new Command(['match','m'],{
  category : 'Dota 2', help : 'Estadísticas de una partida', args : '<id>'},
  async function(msg, args, client, command){
    if(!args[1]){return}
    msg.channel.sendTyping()
    return client.components.Opendota.match(args[1])
      .then(results => {
        if (results[0].error) { return }
        if (results[0].game_mode === 19) { return msg.reply('match.eventgame') }
        
        const spacesBoard = ['19f', '8f', '8f', '6f', '5f', '4f', '17f']
        let radiant = new util.Classes.Table([msg.author.locale('dota2.hero'), msg.author.locale('dota2.kda'), msg.author.locale('dota2.gpmxpm'), msg.author.locale('dota2.lhd'), msg.author.locale('dota2.hdmg'), msg.author.locale('tdmg'), msg.author.locale('dota2.player')], null, spacesBoard, { fill: '\u2002' });
        let dire = new util.Classes.Table([msg.author.locale('dota2.hero'), msg.author.locale('dota2.kda'), msg.author.locale('dota2.gpmxpm'), msg.author.locale('dota2.lhd'), msg.author.locale('dota2.hdmg'), msg.author.locale('tdmg'), msg.author.locale('dota2.player')], null, spacesBoard, { fill: '\u2002' });
        results[0].players.forEach((player, index) => {
          if (index < 5) {
            radiant.addRow([enumHeroes.getValue(player.hero_id).localized_name, player.kills + '/' + player.deaths + '/' + player.assists, player.gold_per_min + '/' + player.xp_per_min, player.last_hits + '/' + player.denies, util.Number.tok(player.hero_damage) + msg.author.locale('number.k'), util.Number.tok(player.tower_damage) + msg.author.locale('number.k'), player.name ? client.components.Bot.parseText(player.name, 'nf') : client.components.Bot.parseText(player.personaname || msg.author.locale('unknown'), 'nf')]);
          } else {
            dire.addRow([enumHeroes.getValue(player.hero_id).localized_name, player.kills + '/' + player.deaths + '/' + player.assists, player.gold_per_min + '/' + player.xp_per_min, player.last_hits + '/' + player.denies, util.Number.tok(player.hero_damage) + msg.author.locale('number.k'), util.Number.tok(player.tower_damage) + msg.author.locale('number.k'),
            player.name ? client.components.Bot.parseText(player.name, 'nf') : client.components.Bot.parseText(player.personaname || msg.author.locale('unknown'), 'nf')]);
          }  
        })
        return msg.reply(embed,{
          team: odutil.winnerTeam(results[0]),
          match_type: results[0].league ? ' :trophy: ' + results[0].league.name : enumLobbyType.getValue(results[0].lobby_type),
          match_skill: enumSkill.getValue(results[0].skill) || '',
          match_id: results[0].match_id,
          match_link: client.config.links.profile.dotabuff.slice(0, -8) + 'matches/' + results[0].match_id,
          duration: odutil.durationTime(results[0].duration),
          time: util.Datee.custom(results[0].start_time * 1000, 'h:m D/M/Y', true),
          _match_field0_name: (results[0].radiant_team ? results[0].radiant_team.name : msg.author.locale('dota2.radiant')) + ' - ' + results[0].radiant_score,
          _match_field0_value: radiant.render(),
          _match_field1_name: (results[0].dire_team ? results[0].dire_team.name : msg.author.locale('dota2.dire')) + ' - ' + results[0].dire_score,
          _match_field1_value: dire.render()
        })
      }).catch(err => { throw new UserError('opendota', 'error.opendotarequest', err) })
  })
