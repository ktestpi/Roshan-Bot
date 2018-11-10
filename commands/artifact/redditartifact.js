const { Command } = require('aghanim')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')

module.exports = new Command(['redditartifact','reddita'],{
  category : 'Artifact', help : 'Información sobre reddit', args : '[idpost,top,hot,new]'},
  function(msg, args, command){
    // let self = this
    if(!args[1]){return}
    const lang = this.locale.getChannelStrings(msg)
    if(['top','hot','new'].indexOf(args[1].toLowerCase()) > -1){
      msg.channel.sendTyping();
      return this.plugins.RedditApi.posts(args[1],5,'artifact').then(result => {
        return msg.reply({embed : {
          author : {name : `r/Artifact - ${args[1]}`, icon_url : this.config.images.redditartifact},
          description : result,
          color : this.config.color
        }})
      }).catch(err => {
        throw new UserError('reddit', 'errorRedditPostsRequest', err)
      })
    }else{
      msg.channel.sendTyping();
      return this.plugins.RedditApi.post(args[1]).then(result => {
        return msg.reply({embed : {
          author : {name : result.title.slice(0,255), url : result.link, icon_url : this.config.images.reddit},
          description : result.text,
          footer : {text : result.subreddit},
          color : this.config.color
        }})
      }).catch(err => {
        throw new UserError('reddit', 'errorRedditPostsRequest', err)
      })
    }
  })
