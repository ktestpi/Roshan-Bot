const { Command } = require('aghanim')
const { Datee, Markdown } = require('erisjs-utils')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'feeds.title',
  description: '<_feeds_description>',
  fields : [
    {name: 'feeds.more', value: '<link_web_feeds>', inline: false}
  ]
})

module.exports = new Command('feeds',{
  category : 'General', help : 'Últimos feeds', args : '<categoría>'},
  async function (msg, args, client, command){
    const feeds = client.cache.feeds.order().slice(0,8)
    return msg.reply(embed,{
      _feeds_description: feeds.map(feed => `\`${Datee.custom(parseInt(feed._id) * 1000, 'h:m D/M', true)}\` **${feed.title}** ${feed.body}${feed.link ? ' ' + Markdown.link(feed.link, ':link:') : ''}`).join('\n')
    })
  })
