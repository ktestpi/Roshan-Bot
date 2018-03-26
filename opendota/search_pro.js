const { Command } = require('drow')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('pro',{subcommandFrom : 'search',
  category : 'Dota 2', help : 'Busca a un/a pro', args : '[búsqueda]'},
  function(msg, args, command){
    let self = this
    const query = args.slice(2).join(' ')
    if(query.length < 3){return}
    opendota.getProPlayersDotaName(query).then((players) => {
      const text = players.map((player) => `**${basic.parseText(opendota.util.nameOrNick(player),'nf')}** ${util.md.link(this.config.links.profile.dotabuff+player.account_id,'DB')}/${util.md.link(player.profileurl,'S')}`).join(', ');
      msg.reply({embed : {
        title : lang.searchproTitle,
        description : this.replace.do(lang.searchproDescription,{query : query, text : text},true),
        footer : {text : this.replace.do(lang.searchproFooter,{match : players.length},true), icon_url : this.user.avatarURL},
        color : this.config.color
      }})
    })
  })
