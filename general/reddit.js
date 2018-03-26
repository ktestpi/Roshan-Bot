const { Command } = require('drow')
// const opendota = require('../helpers/opendota')
// const basic = require('../helpers/basic')
const lang = require('../lang.json')
// const util = require('erisjs-utils')
const reddit = require('../helpers/reddit.js')

module.exports = new Command('reddit',{
  category : 'Dota 2', help : 'Información sobre reddit', args : '[idpost,top,hot,new]'},
  function(msg, args, command){
    // let self = this
    if(['top','hot','new'].indexOf(args[1].toLowerCase()) > -1){
      reddit.posts(args[1],5).then(result => {
        msg.reply({embed : {author : {name : `r/DotA2 - ${args[1]}`, icon_url : this.config.images.redditdota2}, description : result, color : this.config.color}})
      }).catch(err => console.log(err))
    }else{
      if(!args[1]){return}
      reddit.post(args[1]).then(result => {
        msg.reply({embed : {author : {name : result.title.slice(0,255), url : result.link, icon_url : this.config.images.reddit}, description : result.text, color : this.config.color, footer : {text : result.subreddit}}})
      }).catch(err => msg.reply(lang.errorRedditPostRequest))
    }
  })
