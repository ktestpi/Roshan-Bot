const { Datee } = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')
const paintjimp = require('../../paintjimp')
const enumLobbyType = require('../../enums/lobby')
const enumSkill = require('../../enums/skill')

module.exports = {
  name: ['match+','game+'],
  category: 'Dota 2',
  help: 'Estadísticas de una partida. R+',
  args: '<id>',
  requirements: [
    { 
      type: "user.cooldown",
      time: 60,
      response: (msg, args, client, command, req) => msg.author.locale('cmd.incooldown', {cd : args.reqUserCooldown.cooldown, username: args.reqUserCooldown.user})
    }
  ],
  run: async function (msg, args, client, command){
    if (!args[1]) { return }
    msg.channel.sendTyping()
    return client.components.Opendota.match(args[1])
      .then(results => {
        if (results[0].error) { return }
        
        if (results[0].game_mode === 19) { return msg.reply('match.eventgame') }

        return paintjimp.match(results[0])
          .then(buffer => client.createMessage(client.config.guild.generated, `**${msg.author.username}** pidió \`${args[1]}\``, { file: buffer, name: args[1] + ".jpg" }))
          .then(m => {
            return msg.reply({
              embed: {
                title: 'match.title',
                description: 'match.description',
                image: { url: '<_match_image>'},
                footer: { text: 'roshan.plus', icon_url: '<bot_avatar>'}
              }
            }, {
              team: odutil.winnerTeam(results[0]),
              match_type: results[0].league ? ' :trophy: ' + results[0].league.name : enumLobbyType.getValue(results[0].lobby_type),
              match_skill: enumSkill.getValue(results[0].skill) || '',
              match_id: results[0].match_id,
              match_link: client.config.links.profile.dotabuff.slice(0, -8) + 'matches/' + results[0].match_id,
              duration: odutil.durationTime(results[0].duration),
              time: Datee.custom(results[0].start_time * 1000, 'h:m D/M/Y', true),
              _match_image: m.attachments[0].url
            })
          })
      }).catch(err => { return msg.reply('error.opendotarequest') })
  }
}
