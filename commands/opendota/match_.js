const { Command } = require('aghanim')
const { Datee, Markdown } = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')
const paintjimp = require('../../paintjimp')
const enumLobbyType = require('../../enums/lobby')
const enumSkill = require('../../enums/skill')
const { UserError, ConsoleError } = require('../../classes/errors.js')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'match.title',
  description: 'match.description',
  image: { url: '<_match_image>'},
  footer: { text: 'roshan.plus', icon_url: '<bot_avatar>'}
})
module.exports = new Command('match+',{
  category : 'Dota 2', help : 'Estadísticas de una partida. R+', args : '<id>', cooldown : 60,
  cooldownMessage: function (msg, args, client, cooldown) { return args.user.langstring('cmd.incooldown')}},
  async function(msg, args, client){
    if (!args[1]) { return }
    msg.channel.sendTyping()
    return client.components.Opendota.match(args[1])
      .then(results => {
        if (results[0].error) { return }
        
        if (results[0].game_mode === 19) { return msg.reply('match.eventgame') }

        return paintjimp.match(results[0])
          .then(buffer => client.createMessage(client.config.guild.generated, `**${msg.author.username}** pidió \`${args[1]}\``, { file: buffer, name: args[1] + ".jpg" }))
          .then(m => {
            return msg.reply(embed, {
              team: odutil.winnerTeam(results[0]),
              match_type: results[0].league ? ' :trophy: ' + results[0].league.name : enumLobbyType.getValue(results[0].lobby_type),
              match_skill: enumSkill.getValue(results[0].skill) || '',
              match_id: results[0].match_id,
              match_link: client.config.links.profile.dotabuff.slice(0, -8) + 'matches/' + results[0].match_id,
              duration: odutil.durationTime(results[0].duration),
              time: Datee.custom(results[0].start_time * 1000, 'h:m D/M/Y', true),
              _match_image: m.attachments[0].url
            })
            // return msg.reply({
            //   embed: {
            //     title: args.user.locale('matchTitle', { victory: args.user.langstring('victory'), team: odutil.winnerTeam(results[0]) }),
            //     description: (results[0].league ? ' :trophy: ' + results[0].league.name : enumLobbyType.getValue(results[0].lobby_type) + ' ' + (enumSkill.getValue(results[0].skill) || '')) + ' `' + args.user.langstring('matchID') + ': ' + results[0].match_id + '` ' + Markdown.link(client.config.links.profile.dotabuff.slice(0, -8) + 'matches/' + results[0].match_id, args.user.langstring('moreInfo')) + '\n' + args.user.locale('matchTime', { duration: odutil.durationTime(results[0].duration), time: Datee.custom(results[0].start_time * 1000, 'h:m D/M/Y', true) }),
            //     image: { url: m.attachments[0].url },
            //     footer: {text: args.user.langstring('roshanPlus'), icon_url: client.user.avatarURL },
            //     color: client.config.color
            //   }
            // })
          })
      }).catch(err => { throw new UserError('opendota', 'error.opendotarequest', err) })
  })
