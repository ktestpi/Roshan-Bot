const { Datee, Markdown } = require('erisjs-utils')

module.exports = {
  name: 'feeds',
  category: 'General',
  help: 'Últimos feeds',
  args: '<categoría>',
  run: async function (msg, args, client, command){
    const feeds = client.cache.feeds.order().slice(0,8)
    return msg.reply({
      embed: {
        title: 'feeds.title',
        description: '<_feeds_description>',
        fields : [
          {name: 'feeds.more', value: '<link_web_feeds>', inline: false}
        ]
      }
    },{
      _feeds_description: feeds.map(feed => `\`${Datee.custom(parseInt(feed._id) * 1000, 'h:m D/M', true)}\` **${feed.title}** ${feed.body}${feed.link ? ' ' + Markdown.link(feed.link, ':link:') : ''}`).join('\n')
    })
  }
}
