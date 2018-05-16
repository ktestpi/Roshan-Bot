const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const links = require('../containers/links.json')

module.exports = new Command('feeds',{
  category : 'General', help : 'Últimos feeds', args : '<categoría>'},
  function(msg, args, command){
    const feeds = this.cache.feeds.order().slice(0,8)
    const description = feeds.map(feed => `\`${util.dateCustom(parseInt(feed._id)*1000,'h:m D/M',true)}\` **${feed.title}** ${feed.body}${feed.link ? ' ' + util.md.link(feed.link,':link:') : ''}`).join('\n')
    msg.reply({
      embed : {
        title : 'Últimos feeds',
        description : description,
        fields : [{name : 'Más feeds', value : this.config.links.web_feeds, inline : false}],
        // fields : fields,
        // thumbnail : {
        //   url : links[query].thumbnail  || config.bot.icon,
        //   height : 40,
        //   width : 40
        // },
        // footer : {
        //   text : links[query].footer.text,
        //   icon_url : links[query].footer.icon || this.user.avatarURL
        // },
        color : this.config.color
      }
    })
  })
