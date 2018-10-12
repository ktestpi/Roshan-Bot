const { Command } = require('aghanim')
const lang = require('../lang.json')
const max = 1024
module.exports = new Command(['searchcard','scard'],{
  category : 'Artifact', help : 'Busca cartas según texto', args : '<texto>'},
  function(msg, args, command){
    const query = args.from(1)
    if(!query){return}
    const filtered = this.artifactCards.searchCard(query)
    if(!filtered.length){return msg.reply(this.replace.do('searchCardNoFound',{query},true))}
    const reduced = reduceWithCount(filtered.map(c => c.name),max)
    return msg.reply({embed : {
      title : lang.searchCardTitle,
      fields : [
        {name : lang.searchCardSearchText, value : query, inline : false},
        {name : lang.searchCardCards, value : reduced.text, inline : false}
      ],
      footer : {text : this.replace.do('searchCardResults',{results : reduced.count === filtered.length ? reduced.count : reduced.count + '/' + filtered.length},true)},
      color : this.config.color
    }})
  })

  function reduceWithCount(array,max){
    let result = {count : 0, text : ''}
    result.text = array.reduce((acc,cur) => {
      if((acc + ', ' + cur).length < max){result.count++;return acc + ', ' + cur}
      else{return acc}
    })
    result.count++
    return result
  }
