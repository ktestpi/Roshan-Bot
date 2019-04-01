const { Command } = require('aghanim')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embedPosts = new EmbedBuilder({
  author : {name: 'r/Artifact - <_category>', icon_url : '<_reddit_icon_artifact>'},
  description: '<_message>'
})

const embedPost = new EmbedBuilder({
  author: { name: '<_post_title>', url: '<_post_url>', icon_url: '<_reddit_icon>'},
  description : '<_post_text>',
  footer: {text : '<_post_subreddit>'}
})

module.exports = new Command(['redditartifact','reddita'],{
  category : 'Artifact', help : 'Información sobre reddit', args : '[idpost,top,hot,new]'},
  async function(msg, args, client){
    if (!args[1]) { args[1] = 'top'}
    if(['top','hot','new'].indexOf(args[1].toLowerCase()) > -1){
      msg.channel.sendTyping()
      return client.components.RedditApi.posts(args[1],5,'artifact').then(result => {
        return msg.reply(embedPosts,{
          _category : args[1],
          _reddit_icon_artifact: client.config.images.redditartifact,
          _message: result
        })
      }).catch(err => {
        throw new UserError('reddit', 'reddit.error.postsrequest', err)
      })
    }else{
      msg.channel.sendTyping();
      return client.components.RedditApi.post(args[1]).then(result => {
        return msg.reply(embedPost,{
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
