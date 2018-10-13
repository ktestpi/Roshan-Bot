const { Command } = require('aghanim')
const lang = require('../lang.json')
const reddit = require('../helpers/reddit.js')

module.exports = new Command(['redditartifact','reddita'],{
  category : 'Dota 2', help : 'Información sobre reddit', args : '[idpost,top,hot,new]'},
  function(msg, args, command){
    // let self = this
    if(!args[1]){return}
    if(['top','hot','new'].indexOf(args[1].toLowerCase()) > -1){
      reddit.posts(args[1],5,'artifact').then(result => {
        msg.reply({embed : {author : {name : `r/Artifact - ${args[1]}`, icon_url : this.config.images.redditartifact}, description : result, color : this.config.color}})
      }).catch(err => {
        this.discordLog.send('error',lang.errorRedditPostsRequest,lang.errorRedditPostsRequest,err,msg.channel)
      })
    }else{
      reddit.post(args[1]).then(result => {
        msg.reply({embed : {author : {name : result.title.slice(0,255), url : result.link, icon_url : this.config.images.reddit}, description : result.text, color : this.config.color, footer : {text : result.subreddit}}})
      }).catch(err => {
        this.discordLog.send('error',lang.errorRedditPostsRequest,lang.errorRedditPostsRequest,err,msg.channel)
      })
    }
  })
