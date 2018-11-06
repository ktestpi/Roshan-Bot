const { Command } = require('aghanim')
const reddit = require('../../helpers/reddit.js')

module.exports = new Command(['redditdota','redditd'],{
  category : 'Dota 2', help : 'Información sobre reddit', args : '[idpost,top,hot,new]'},
  function(msg, args, command){
    // let self = this
    if(!args[1]){return}
    if(['top','hot','new'].indexOf(args[1].toLowerCase()) > -1){
      msg.channel.sendTyping();
      return reddit.posts(args[1],5,'dota2').then(result => {
        return msg.reply({embed : {
          author : {name : `r/DotA2 - ${args[1]}`, icon_url : this.config.images.redditdota2},
          description : result,
          color : this.config.color
        }})
      }).catch(err => {
        this.discordLog.send('error',this.locale.getDevString('errorRedditPostsRequest',msg),this.locale.getUserString('errorRedditPostsRequest',msg),err,msg.channel)
      })
    }else{
      msg.channel.sendTyping();
      return reddit.post(args[1]).then(result => {
        return msg.reply({embed : {author : {name : result.title.slice(0,255), url : result.link, icon_url : this.config.images.reddit},
        description : result.text,
        footer : {text : result.subreddit},
        color : this.config.color
      }})
      }).catch(err => {
        this.discordLog.send('error',this.locale.getDevString('errorRedditPostsRequest',msg),this.locale.getUserString('errorRedditPostsRequest',msg),err,msg.channel)
      })
    }
  })
