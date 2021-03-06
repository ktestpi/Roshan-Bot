const { Markdown, Request } = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')

module.exports = {
  name: 'searchplayer',
  category: 'Dota 2',
  help: 'Busca a un/a jugador/a',
  args: '[búsqueda]',
  run: async function(msg, args, client, command){
    const query = args.slice(1).join(' ')
    if(query.length < 2){return msg.reply('searchplayer.mincharsrequired')}
    msg.channel.sendTyping()
    return client.components.Opendota.getPlayersDotaName(query).then((players) => {
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
        return msg.reply({
          embed: {
            title: 'searchplayer.title',
            description: 'searchplayer.description',
            footer: {text : 'searchplayer.footer', icon_url : '<bot_avatar>'}
          }
        },{
          query: query,
          text: text,
          match: playersShow !== playersTotal ? playersShow + "/" + playersTotal : playersShow
        })
      })
    })
  }
}
