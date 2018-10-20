const { Command } = require('aghanim')
const { Markdown } = require('erisjs-utils')
const opendota = require('../../helpers/opendota')
const basic = require('../../helpers/basic')

module.exports = new Command('searchpro',{
  category : 'Dota 2', help : 'Busca a un/a pro', args : '[búsqueda]'},
  function(msg, args, command){
    let self = this
    const query = args.slice(1).join(' ')
    const lang = this.locale.getUserStrings(msg)
    if(query.length < 2){return msg.reply(lang.errorSearchMinChars)}
    opendota.getProPlayersDotaName(query).then((players) => {
      const text = players.map((player) => `**${basic.parseText(opendota.util.nameOrNick(player),'nf')}** ${Markdown.link(this.config.links.profile.dotabuff+player.account_id,'DB')}/${Markdown.link(player.profileurl,'S')}`).join(', ');
      msg.reply({embed : {
        title : lang.searchproTitle,
        description : this.locale.replacer(lang.searchproDescription,{query : query, text : text}),
        footer : {text : this.locale.replacer(lang.searchproFooter,{match : players.length}), icon_url : this.user.avatarURL},
        color : this.config.color
      }})
    })
  })
