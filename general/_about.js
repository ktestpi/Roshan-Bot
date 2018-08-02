const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const { Markdown } = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('about',{
  category : 'General', help : 'Información sobre el bot', args : '[errors,thanks]'},
  function(msg, args, command){
    msg.reply({
      embed : {
        title : this.replace.do(lang.aboutTitle),
        description : this.replace.do(lang.aboutDescription),
        fields : [
          {name : lang.invite,
          value : Markdown.link(lang.invitation,this.config.invite,true),
          inline : false},
          {name : lang.devServer,
          value : Markdown.link(lang.discord,this.config.server,true),
          inline : false},
          {name : lang.patreon,
          value : this.replace.do(lang.patreonDesc,{link : this.config.links.patreon}),
          inline : false},
        ],
        thumbnail : {url: this.user.avatarURL, height : 40, width : 40},
        footer : {
          text : this.replace.do('aboutFooter'), icon_url : this.user.avatarURL},
        color : this.config.color
      }
    });
  })
