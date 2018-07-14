const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const enumHeroes = require('../helpers/enums/heroes')
const enumPlayerPos = require('../helpers/enums/player_positions')

module.exports = new Command('cardconfig',{
  category : 'Cuenta', help : 'Ayuda de la tarjeta de jugador@', args : ''},
  function(msg, args, command){
    // let self = this

    const profile = this.cache.profiles.get(msg.author.id)
    if(!profile){return} //needregister
    let heroes = profile.card.heroes.split(',')
    console.log(args.length);
    if(args.length > 1){
      let _heroes = [], _pos = []
      for (var i = 1; i < args.length; i++) {
        if(args[i].startsWith('.')){
          const hero = enumHeroes.getHeroIDbyTag(args[i].slice(1))
          if(hero !== undefined){_heroes.push(hero)}
        }else if(args[i].startsWith('-') && !_pos.length){
          const position = enumPlayerPos(args[i].slice(1))
          if(position){_pos.push(args[i].slice(1))}
        }
      }

      let counter = 0
      do{
        if(_heroes[counter]){heroes[counter] = _heroes[counter]}
        counter++
      }while(counter < 3)
      let update = {}
      if(_heroes.length){update.heroes = heroes.join(',')}
      if(_pos.length){update.pos = _pos.join(',')}
      if(!Object.keys(update).length){return}
      this.cache.profiles.modify(msg.author.id,{card : update}).then(() => msg.addReaction(this.config.emojis.default.accept))
    }else{
      msg.reply({embed : {
        title : this.replace.do(lang.playerCard,{username : msg.author.username},true),
        thumbnail : {url : msg.author.avatarURL, width : 40, height : 40},
        fields : [
          {name : 'Héroes destacados', value : `\`\`\`${heroes.map(h => enumHeroes(h).name).join(', ')}\`\`\``, inline : false},
          {name : 'Posición', value : `\`\`\`${enumPlayerPos(profile.card.pos)}\`\`\``, inline : false}
        ],
        footer : {text : 'Roshan Card', icon_url : this.user.avatarURL},
        color : this. config.color
      }})
    }

  })
