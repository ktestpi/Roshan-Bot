const { Command } = require('aghanim')
const { UserError, ConsoleError } = require('../../classes/errors.js')

module.exports = new Command('underlords',{subcommandFrom: 'reddit',
  category : 'General', help : 'Información sobre reddit', args : '[idpost,top,hot,new]'},
  async function (msg, args, client, command){
    const query = args[2] || 'top'
    if(['top','hot','new'].indexOf(query.toLowerCase()) > -1){
      msg.channel.sendTyping();
      return client.components.RedditApi.posts(query, 5,'underlords').then(result => {
        return msg.reply({
          embed: {
            author: { name: 'r/Dota Underlords - <_category>', icon_url: '<image_reddit_dota_underlords>' },
            description: '<_message>'
          }
        },{
          _category: query,
          _message: result
        })
      }).catch(err => {
        throw new UserError('reddit', 'reddit.error.postsrequest', err)
      })
    }else{
      msg.channel.sendTyping();
      return client.components.RedditApi.post(query).then(result => {
        return msg.reply({
          embed: {
            author: { name: '<_post_title>', url: '<_post_url>', icon_url: '<_reddit_icon>' },
            description: '<_post_text>',
            footer: { text: '<_post_subreddit>' }
          }
        },{
          _post_title: result.title.slice(0, 255),
          _post_url: result.link,
          _reddit_icon: client.config.images.reddit,
          _post_text: result.text,
          _post_subreddit: result.subreddit
        })
      }).catch(err => {
        throw new UserError('reddit', 'reddit.error.postrequest', err)
      })
    }
  })
