const { Command } = require('aghanim')
const { Datee, Markdown } = require('erisjs-utils')
const links = require('../../containers/links.json')

module.exports = new Command('feeds',{
  category : 'General', help : 'Últimos feeds', args : '<categoría>'},
  function(msg, args, command){
    const feeds = this.cache.feeds.order().slice(0,8)
    const description = feeds.map(feed => `\`${Datee.custom(parseInt(feed._id)*1000,'h:m D/M',true)}\` **${feed.title}** ${feed.body}${feed.link ? ' ' + Markdown.link(feed.link,':link:') : ''}`).join('\n')
    const lang = this.locale.getUserStrings(msg)
    msg.reply({
      embed : {
        title : lang.lastFeeds,
        description : description,
        fields : [{name : lang.moreFeeds, value : this.config.links.web_feeds, inline : false}],
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
