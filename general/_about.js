const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('about',{
  category : 'General', help : 'Información sobre el bot', args : '[errors,thanks]'},
  function(msg, args, command){
    let self = this
    msg.reply({
      embed : {
        title : this.replace.do(lang.aboutTitle),
        description : this.replace.do(lang.aboutDescription),
        fields : [
          {name : lang.invite,
          value : util.md.link(lang.invitation,this.config.invite,true),
          inline : false},
          {name : lang.inviteServer,
          value : util.md.link(lang.discord,this.config.server,true),
          inline : false},
          {name : lang.patreon,
          value : this.replace.do(lang.patreonDesc,{link : this.config.links.patreon}),
          inline : false},
        ],
        thumbnail : {url: this.user.avatarURL, height : 40, width : 40},
        footer : {
          text : self.replace.do('aboutFooter'), icon_url : this.user.avatarURL},
        color : this.config.color
      }
    });
  })
