const util = require('erisjs-utils')

module.exports = {
  name: 'tourneys',
  category: 'General',
  help: 'Últimos torneos o muestra info sobre torneo',
  args: '[nombre torneo]',
  run: async function(msg, args, client, command){
    if(!args[1]){
      let tourneys_playing = client.cache.tourneys.getPlaying()
      let tourneys_next = client.cache.tourneys.getNext()
      let fields = []
      if (tourneys_playing.length && !tourneys_next.length) { return msg.reply('tourneys.error.noevents')}
      if(tourneys_playing.length){
        tourneys_playing.sort(sortTourneysPlaying)
        fields.push({ name: msg.author.locale('tourneys.now',{events : tourneys_playing.length}), value : tourneys_playing.map(t => `**${t._id}**${t.finish ? ' \`' + util.Date.custom(parseInt(t.finish)*1000,'D/M',true) + '\`' : ''}`).join(', '), inline : false})
      }
      if(tourneys_next.length){
        tourneys_next.sort(sortTourneysNext)
        fields.push({name: msg.author.locale('tourneys.next',{events : tourneys_next.length}), value : tourneys_next.map(t => `**${t._id}**${t.until ? ' \`' + util.Date.custom(parseInt(t.until)*1000,'D/M',true) + '\`' : ''}`).join(', '), inline : false})
      }
      fields.push({name : msg.author.locale('tourneys.suggestion'), value : client.config.links.web_addtourney, inline : false})
      msg.reply({
        embed : {
          title : msg.author.locale('tourneys.title'),
          fields : fields,
          color : client.config.color
        }
      })
    }else{
      const search = args.from(1)
      if(!search){return}
      const tourney = client.cache.tourneys.find(t => t._id.toLowerCase() === search.toLowerCase())
      if (!tourney) { return msg.reply('tourneys.error.search',{search})}
      let fields = []
      if (tourney.start) { fields.push({ name: msg.author.locale('tourneys.begin'), value : util.Date.custom(parseInt(tourney.start)*1000,'D/M',true), inline : true})}
      if (tourney.finish) { fields.push({ name: msg.author.locale('tourneys.finish'), value : util.Date.custom(parseInt(tourney.finish)*1000,'D/M',true), inline : true})}
      if (tourney.until) { fields.push({ name: msg.author.locale('tourneys.until'), value : util.Date.custom(parseInt(tourney.until)*1000,'D/M',true), inline : true})}
      if (tourney.link) { fields.push({ name: msg.author.locale('global.link'), value : tourney.link, inline : true})}
      return msg.reply({embed : {
        title : `${tourney._id}${tourney.by ? ' (' + tourney.by +')' : ''}`,
        description : tourney.info || '',
        fields : fields.length ? fields : null,
        thumbnail : {
          url : tourney.img,
          height : 40,
          width : 40
        },
        color : client.config.color
      }})
    }
  }
}

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
