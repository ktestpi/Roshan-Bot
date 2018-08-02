const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const lang = require('../lang.json')
const enumHeroes = require('../helpers/enums/heroes')
const enumPlayerPos = require('../helpers/enums/player_positions')

module.exports = new Command('cardconfig',{
  category : 'Cuenta', help : 'Ayuda de la tarjeta de jugador@', args : ''},
  function(msg, args, command){
    const profile = this.cache.profiles.get(msg.author.id)
    if(!profile){return basic.needRegister(msg,user.id)}
    let heroes = profile.card.heroes.split(',')
    if(args.length > 1){
      let _heroes = [], _pos = []
      for (var i = 1; i < args.length; i++) {
        if(args[i].startsWith('.')){
          const hero = enumHeroes.getKey(args[i].slice(1))
          if(hero){_heroes.push(hero)}
        }else if(args[i].startsWith('-') && !_pos.length){
          const position = enumPlayerPos.getValue(args[i].slice(1))
          if(position){_pos.push(args[i].slice(1))}
        }
      }
      if(_heroes.length > 0  && _heroes.length < 3){return msg.reply('Debes establecer 3 héroes')}
      let counter = 0
      do{
        if(_heroes[counter]){heroes[counter] = _heroes[counter]}
        counter++
      }while(counter < 3)
      let update = {}
      if(_heroes.length){update.heroes = _heroes.join(',')}
      if(_pos.length){update.pos = _pos.join(',')}
      if(!Object.keys(update).length){return}
      this.cache.profiles.modify(msg.author.id,{card : update}).then(() => msg.addReaction(this.config.emojis.default.accept))
    }else{
      msg.reply({embed : {
        title : this.replace.do(lang.playerCard,{username : msg.author.username},true),
        thumbnail : {url : msg.author.avatarURL, width : 40, height : 40},
        fields : [
          {name : lang.highlightsHeroes, value : `\`\`\`${profile.card.heroes ? heroes.map(h => enumHeroes.getValue(h).name).join(', ') : this.replace.do(lang.errorCardNoHeroesConfig,{cmd : 'r!cardhelp'},true)}\`\`\``, inline : false},
          {name : lang.position, value : `\`\`\`${enumPlayerPos.getValue(profile.card.pos)}\`\`\``, inline : false}
        ],
        footer : {text : lang.roshanCard, icon_url : this.user.avatarURL},
        color : this. config.color
      }})
    }
  })
