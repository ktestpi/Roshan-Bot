const { Command } = require('aghanim')
const { Markdown, Request } = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')
const { UserError, ConsoleError } = require('../../classes/errors.js')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'searchplayer.title',
  description: 'searchplayer.description',
  footer: {text : 'searchplayer.footer', icon_url : '<bot_avatar>'}
})

module.exports = new Command('searchplayer',{
  category : 'Dota 2', help : 'Busca a un/a jugador/a', args : '[búsqueda]'},
  async function(msg, args, client){
    const query = args.slice(1).join(' ')
    if(query.length < 2){return msg.reply('searchplayer.mincharsrequired')}
    msg.channel.sendTyping()
    client.components.Opendota.getPlayersDotaName(query).then((players) => {
      if(players.length < 1){return};
      const playersTotal = players.length;
      const limit = 10;
      // if(players.length > limit){
      //   players.sort(function() {
      //     return .5 - Math.random()});
      //   players = players.slice(0,limit)
      // }
      players.sort(function(a,b) {
        return b.similarity - a.similarity})
      if(players.length > limit){
        players = players.slice(0,limit)
      }
      const playersShow = players.length;
      const urls = players.map(player => 'https://api.opendota.com/api/players/' + player.account_id);
      return Request.getJSONMulti(urls).then((player_profiles) => {
        const text = player_profiles.map((player) => player.profile).map((player) => `**${client.components.Bot.parseText(odutil.nameOrNick(player),'nf')}** ${Markdown.link(client.config.links.profile.dotabuff+player.account_id,'DB')}/${Markdown.link(player.profileurl,'S')}`).join(', ');
        return msg.reply(embed,{
          query: query,
          text: text,
          match: playersShow !== playersTotal ? playersShow + "/" + playersTotal : playersShow
        })
        // return msg.reply({embed : {
        //   title : args.user.langstring('searchplayerTitle'),
        //   description : args.user.locale('searchplayerDescription',{query : query, text : text}),
        //   footer : {text : args.user.locale('searchplayerFooter',{match : playersShow !== playersTotal ? playersShow + "/" + playersTotal : playersShow}), icon_url : client.user.avatarURL},
        //   color : client.config.color
        // }})
      }).catch(err => { throw new UserError('opendota', 'error.opendotarequest', err) })
    })
  })
