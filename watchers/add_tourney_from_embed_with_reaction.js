const { Watcher } = require('aghanim')
const util = require('erisjs-utils')

module.exports = new Watcher('','messageReactionAdd',{}, function(msg,emoji,userID){
  // console.log('ADD TOURNEY BEFORE',msg);
  if(userID === this.owner.id && emoji.name === this.config.emojis.default.trophy){
    // && msg.author.id === this.user.id && msg.embeds[0] && msg.embeds[0].title === 'Nuevo torneo'
    msg.channel.getMessage(msg.id).then(m => {
      // console.log('ADD TOURNEY INNER',m);
      // console.log(m.author.id === this.user.id,m.embeds[0] ? true : false,m.embeds[0].title === 'Nuevo torneo');
      if(m.author.id === this.config.webhooks.fromapp && m.embeds[0] && m.embeds[0].title === 'Nuevo torneo'){
        // console.log('ADD TOURNEY CHECKED',msg);
        const embed = m.embeds[0]
        const data = {
          [embed.fields[0].value] : {
            by : ndToVoidString(embed.fields[1].value),
            start : ndToVoidString(embed.fields[2].value,true),
            finish : ndToVoidString(embed.fields[3].value,true),
            until : ndToVoidString(embed.fields[4].value,true),
            img : ndToVoidString(embed.thumbnail.url),
            link : ndToVoidString(embed.fields[5].value),
            info : ndToVoidString(embed.description),
            ts : util.date()
          }
        }
        // console.log('DATA',data);
        this.db.child('tourneys').update(data).then(() => m.addReaction(this.config.emojis.default.accept))
      }
    })
  }
})

function ndToVoidString(text,int){ return text === 'ND' ? '' : int ? parseInt(text) : text }
