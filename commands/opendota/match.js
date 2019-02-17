const { Command } = require('aghanim')
const util = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')
const enumHeroes = require('../../enums/heroes')
const enumLobbyType = require('../../enums/lobby')
const enumSkill = require('../../enums/skill')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')
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
  async function(msg, args, client){
    if(!args[1]){return}
    msg.channel.sendTyping()
    return client.components.Opendota.match(args[1])
      .then(results => {
        if (results[0].error) { return }
        if (results[0].game_mode === 19) { return msg.reply('match.eventgame') }
        
        const spacesBoard = ['19f', '8f', '8f', '6f', '5f', '4f', '17f']
        let radiant = new util.Classes.Table([args.user.langstring('dota2.hero'), args.user.langstring('dota2.kda'), args.user.langstring('dota2.gpmxpm'), args.user.langstring('dota2.lhd'), args.user.langstring('dota2.hdmg'), args.user.langstring('tdmg'), args.user.langstring('dota2.player')], null, spacesBoard, { fill: '\u2002' });
        let dire = new util.Classes.Table([args.user.langstring('dota2.hero'), args.user.langstring('dota2.kda'), args.user.langstring('dota2.gpmxpm'), args.user.langstring('dota2.lhd'), args.user.langstring('dota2.hdmg'), args.user.langstring('tdmg'), args.user.langstring('dota2.player')], null, spacesBoard, { fill: '\u2002' });
        results[0].players.forEach((player, index) => {
          if (index < 5) {
            radiant.addRow([enumHeroes.getValue(player.hero_id).localized_name, player.kills + '/' + player.deaths + '/' + player.assists, player.gold_per_min + '/' + player.xp_per_min, player.last_hits + '/' + player.denies, util.Number.tok(player.hero_damage) + args.user.langstring('number.k'), util.Number.tok(player.tower_damage) + args.user.langstring('number.k'), player.name ? client.components.Bot.parseText(player.name, 'nf') : client.components.Bot.parseText(player.personaname || args.user.langstring('unknown'), 'nf')]);
          } else {
            dire.addRow([enumHeroes.getValue(player.hero_id).localized_name, player.kills + '/' + player.deaths + '/' + player.assists, player.gold_per_min + '/' + player.xp_per_min, player.last_hits + '/' + player.denies, util.Number.tok(player.hero_damage) + args.user.langstring('number.k'), util.Number.tok(player.tower_damage) + args.user.langstring('number.k'),
            player.name ? client.components.Bot.parseText(player.name, 'nf') : client.components.Bot.parseText(player.personaname || args.user.langstring('unknown'), 'nf')]);
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
          _match_field0_name: (results[0].radiant_team ? results[0].radiant_team.name : args.user.langstring('dota2.radiant')) + ' - ' + results[0].radiant_score,
          _match_field0_value: radiant.render(),
          _match_field1_name: (results[0].dire_team ? results[0].dire_team.name : args.user.langstring('dota2.dire')) + ' - ' + results[0].dire_score,
          _match_field1_value: dire.render()
        })
        // return msg.reply({
        //   embed: {
        //     title: args.user.locale('matchTitle', {
        //       victory: args.user.langstring('victory'), team: odutil.winnerTeam(results[0])}),
        //     description: (results[0].league ? ' :trophy: ' + results[0].league.name : enumLobbyType.getValue(results[0].lobby_type) + ' ' + (enumSkill.getValue(results[0].skill) || '')) + ' `' + args.user.langstring('matchID') + ': ' + results[0].match_id + '` ' + util.Markdown.link(client.config.links.profile.dotabuff.slice(0, -8) + 'matches/' + results[0].match_id, args.user.langstring('moreInfo')) + '\n' + args.user.locale('matchTime', { duration: odutil.durationTime(results[0].duration), time: util.Date.custom(results[0].start_time * 1000, 'h:m D/M/Y') }),
        //     fields: [
        //       {
        //         name: (results[0].radiant_team ? results[0].radiant_team.name : args.user.langstring('radiant')) + ' - ' + results[0].radiant_score,
        //         value: radiant.render(),
        //         inline: false
        //       },
        //       {
        //         name: (results[0].dire_team ? results[0].dire_team.name : args.user.langstring('dire')) + ' - ' + results[0].dire_score,
        //         value: dire.render(),
        //         inline: false
        //       },
        //     ],
        //     color: client.config.color
        //   }
        // })
      }).catch(err => { throw new UserError('opendota', 'error.opendotarequest', err) })
  })
