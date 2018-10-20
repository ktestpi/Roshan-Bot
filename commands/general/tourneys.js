const { Command } = require('aghanim')
const util = require('erisjs-utils')
const { sortTourneys } = require('../../helpers/basic')

module.exports = new Command('tourneys',{
  category : 'General', help : 'Últimos torneos o muestra info sobre torneo', args : '[nombre torneo]'},
  function(msg, args, command){
    // const tourneys = this.cache.tourneys.order().slice(0,8)
    // const description = tourneys.map(tourney => tourney._id).join('\n')
    const lang = this.locale.getUsetStrings(msg)
    if(!args[1]){
      let tourneys_playing = this.cache.tourneys.getPlaying()
      let tourneys_next = this.cache.tourneys.getNext()
      let fields = []
      if(tourneys_playing.length && !tourneys_next.length){return msg.reply(lang.errorTourneysNoEvents)}
      if(tourneys_playing.length){
        tourneys_playing.sort(sortTourneysPlaying)
        fields.push({name: this.locale.replacer(lang.tourneysNow,{events : tourneys_playing.length}), value : tourneys_playing.map(t => `**${t._id}**${t.finish ? ' \`' + util.Date.custom(parseInt(t.finish)*1000,'D/M',true) + '\`' : ''}`).join(', '), inline : false})
      }
      if(tourneys_next.length){
        tourneys_next.sort(sortTourneysNext)
        fields.push({name: this.locale.replacer(lang.tourneysNext,msg,{events : tourneys_next.length}), value : tourneys_next.map(t => `**${t._id}**${t.until ? ' \`' + util.Date.custom(parseInt(t.until)*1000,'D/M',true) + '\`' : ''}`).join(', '), inline : false})
      }
      fields.push({name : lang.tourneysSuggestion, value : this.config.links.web_addtourney, inline : false})
      // const description = tourneys.map(tourney => `\`${util.Date.custom(parseInt(feed._id)*1000,'h:m D/M',true)}\` **${feed.title}** ${feed.body}${feed.link ? ' ' + util.md.link(feed.link,':link:') : ''}`).join('\n')
      msg.reply({
        embed : {
          title : lang.tourneysTitle,
          // description : description,
          fields : fields,
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
    }else{
      const search = args.from(1)
      if(!search){return}
      const tourney = this.cache.tourneys.bucket.find(t => t._id.toLowerCase() === search.toLowerCase())
      if(!tourney){return msg.reply(this.locale.replacer(lang.errorTourneysSearch,{search}))}
      let fields = []
      if(tourney.start){fields.push({name : lang.tourneysBegin, value : util.Date.custom(parseInt(tourney.start)*1000,'D/M',true), inline : true})}
      if(tourney.finish){fields.push({name : lang.tourneysFinish, value : util.Date.custom(parseInt(tourney.finish)*1000,'D/M',true), inline : true})}
      if(tourney.until){fields.push({name : lang.tourneysUntil, value : util.Date.custom(parseInt(tourney.until)*1000,'D/M',true), inline : true})}
      if(tourney.link){fields.push({name : lang.link, value : tourney.link, inline : true})}
      msg.reply({embed : {
        title : `${tourney._id}${tourney.by ? ' (' + tourney.by +')' : ''}`,
        description : tourney.info || '',
        fields : fields.length ? fields : null,
        thumbnail : {
          url : tourney.img,
          height : 40,
          width : 40
        },
        color : this.config.color
      }})
    }
  })

function sortTourneysNext(a,b){
  if(a.start && b.start){
    return a.start - b.start
  }else if(a.start && b.until){
    return a.start - b.until
  }else if(a.until && b.start){
    return a.until - b.start
  }else if(a.start && (!b.start && !b.until)){
    return -1
  }else if(b.start && (!a.start && !a.until)){
    return 1
  }else if(a.until && b.until){
    return a.until - b.until
  }else if(a._id.toLowerCase() > b._id.toLowerCase()){return -1}
  else if(a._id.toLowerCase() > b._id.toLowerCase()){return 1}
  else{return 0}
}

function sortTourneysPlaying(a,b){
  if(a.finish && b.finish){
    return a.finish - b.finish
  }else if(a.start && b.finish){
    return a.start - b.finish
  }else if(a.finish && b.start){
    return a.finish - b.start
  }else if(a.start && b.start){
    return a.start - b.start
  }else if(a._id.toLowerCase() > b._id.toLowerCase()){return -1}
  else if(a._id.toLowerCase() > b._id.toLowerCase()){return 1}
  else{return 0}
}
