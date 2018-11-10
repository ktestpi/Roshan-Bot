const { Command } = require('aghanim')
const { Markdown } = require('erisjs-utils')
const odutil = require('../../helpers/opendota-utils')
const basic = require('../../helpers/basic')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')

module.exports = new Command('searchpro',{
  category : 'Dota 2', help : 'Busca a un/a pro', args : '[búsqueda]'},
  function(msg, args, command){
    const query = args.slice(1).join(' ')
    const lang = this.locale.getUserStrings(msg)
    if(query.length < 2){return msg.reply(lang.errorSearchMinChars)}
    return this.plugins.Opendota.getProPlayersDotaName(query)
      .then((players) => {
        const text = players.map((player) => `**${basic.parseText(odutil.nameOrNick(player),'nf')}** ${Markdown.link(this.config.links.profile.dotabuff+player.account_id,'DB')}/${Markdown.link(player.profileurl,'S')}`).join(', ');
        msg.reply({embed : {
          title : lang.searchproTitle,
          description : this.locale.replacer(lang.searchproDescription,{query : query, text : text}),
          footer : {text : this.locale.replacer(lang.searchproFooter,{match : players.length}), icon_url : this.user.avatarURL},
          color : this.config.color
        }})
      }).catch(err => { throw new UserError('opendota', 'errorOpendotaRequest', err) })
  })
