const { Command } = require('aghanim')
const { Markdown } = require('erisjs-utils')

module.exports = new Command('about',{
  category : 'General', help : 'Información sobre el bot', args : '[errors,thanks]'},
  function(msg, args, command){
    const lang = this.locale.getUserStrings(msg)
    return msg.reply({
      embed : {
        title : this.locale.replacer(lang.aboutTitle),
        description : this.locale.replacer(lang.aboutDescription),
        fields : [
          {name : lang.invite,
          value : Markdown.link(lang.invitation,this.config.invite,true),
          inline : false},
          {name : lang.devServer,
          value : Markdown.link(lang.discord,this.config.server,true),
          inline : false},
          {name : lang.patreon,
          value : this.locale.replacer(lang.patreonDesc,{link : this.config.links.patreon}),
          inline : false},
        ],
        thumbnail : {url: this.user.avatarURL, height : 40, width : 40},
        footer : {
          text : this.locale.replacer(lang.aboutFooter), icon_url : this.user.avatarURL},
        color : this.config.color
      }
    });
  })
