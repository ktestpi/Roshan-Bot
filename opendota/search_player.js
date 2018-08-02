const { Command } = require('aghanim')
const { Markdown, Request } = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('player',{subcommandFrom : 'search',
  category : 'Dota 2', help : 'Busca a un/a jugador/a', args : '[búsqueda]'},
  function(msg, args, command){
    let self = this
    const query = args.slice(2).join(' ')
    if(query.length < 2){return msg.reply(lang.errorSearchMinChars)}
    opendota.getPlayersDotaName(query).then((players) => {
      if(players.length < 1){return};
      const playersTotal = players.length;
      const limit = 10;
      // console.log('Players',players);
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
      Request.getJSONMulti(urls).then((player_profiles) => {
        const text = player_profiles.map((player) => player.profile).map((player) => `**${basic.parseText(opendota.util.nameOrNick(player),'nf')}** ${Markdown.link(this.config.links.profile.dotabuff+player.account_id,'DB')}/${Markdown.link(player.profileurl,'S')}`).join(', ');
        msg.reply({embed : {
          title : lang.searchplayerTitle,
          description : this.replace.do(lang.searchplayerDescription,{query : query, text : text},true),
          footer : {text : this.replace.do(lang.searchplayerFooter,{match : playersShow !== playersTotal ? playersShow + "/" + playersTotal : playersShow},true), icon_url : this.user.avatarURL},
          color : this.config.color
        }})
      }).catch(err => this.discordLog('oderror',lang.errorOpendotaRequest,lang.errorOpendotaRequest,err,msg.channel))
    })
  })
