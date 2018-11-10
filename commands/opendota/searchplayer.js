const { Command } = require('aghanim')
const { Markdown, Request } = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')
const basic = require('../../helpers/basic')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')

module.exports = new Command('searchplayer',{
  category : 'Dota 2', help : 'Busca a un/a jugador/a', args : '[búsqueda]'},
  function(msg, args, command){
    let self = this
    const query = args.slice(1).join(' ')
    const lang = this.locale.getUserStrings(msg)
    if(query.length < 2){return msg.reply(lang.errorSearchMinChars)}
    msg.channel.sendTyping()
    this.plugins.Opendota.getPlayersDotaName(query).then((players) => {
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
        const text = player_profiles.map((player) => player.profile).map((player) => `**${basic.parseText(odutil.nameOrNick(player),'nf')}** ${Markdown.link(this.config.links.profile.dotabuff+player.account_id,'DB')}/${Markdown.link(player.profileurl,'S')}`).join(', ');
        return msg.reply({embed : {
          title : lang.searchplayerTitle,
          description : this.locale.replacer(lang.searchplayerDescription,{query : query, text : text}),
          footer : {text : this.locale.replacer(lang.searchplayerFooter,{match : playersShow !== playersTotal ? playersShow + "/" + playersTotal : playersShow}), icon_url : this.user.avatarURL},
          color : this.config.color
        }})
      }).catch(err => { throw new UserError('opendota', 'errorOpendotaRequest', err) })
    })
  })
