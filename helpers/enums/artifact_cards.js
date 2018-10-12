const card_types = require('artifact-database/constants/cards_types.json')
const skills_types = require('artifact-database/constants/skills_types.json')
const rarities = require('artifact-database/constants/rarities.json')
const cards_colors = require('artifact-database/constants/cards_colors.json')
const fs = require('fs')
const _sig = ':sig'
// const card_types_icon = {
//   '1' : 'https://www.artifactbuff.com/images/cardtype-hero.png', //https://github.com/Desvelao/artifact-database/blob/master/assets/cardtype/hero.png?raw=true
//   '2' : 'https://www.artifactbuff.com/images/cardtype-creep.png',
//   '3' : 'https://www.artifactbuff.com/images/cardtype-spell.png',
//   '4' : 'https://www.artifactbuff.com/images/cardtype-improvement.png',
//   '5' : 'https://www.artifactbuff.com/images/cardtype-item-weapon.png',
//   '6' : 'https://www.artifactbuff.com/images/cardtype-item-armor.png',
//   '7' : 'https://www.artifactbuff.com/images/cardtype-item-accessory.png',
//   '8' : 'https://www.artifactbuff.com/images/cardtype-item-consumible.png'
// }

const card_types_icon = {
  '1' : 'https://github.com/Desvelao/artifact-assets/blob/master/assets/cards_types/hero.png?raw=true',
  '2' : 'https://github.com/Desvelao/artifact-assets/blob/master/assets/cards_types/creep.png?raw=true',
  '3' : 'https://github.com/Desvelao/artifact-assets/blob/master/assets/cards_types/spell.png?raw=true',
  '4' : 'https://github.com/Desvelao/artifact-assets/blob/master/assets/cards_types/improvement.png?raw=true',
  '5' : 'https://github.com/Desvelao/artifact-assets/blob/master/assets/cards_types/weapon.png?raw=true',
  '6' : 'https://github.com/Desvelao/artifact-assets/blob/master/assets/cards_types/armor.png?raw=true',
  '7' : 'https://github.com/Desvelao/artifact-assets/blob/master/assets/cards_types/accessory.png?raw=true',
  // '8' : 'https://github.com/Desvelao/artifact-assets/blob/master/assets/cards_types/consumible.png?raw=true',
  '8' : 'https://raw.githubusercontent.com/Desvelao/artifact-assets/master/assets/cards_types/consumible.png'
}


const rarities_icon = {
  'b' : 'https://www.artifactbuff.com/images/set-0-basic.png',
  'c' : 'https://www.artifactbuff.com/images/set-1-common.png',
  'u' : 'https://www.artifactbuff.com/images/set-1-uncommon.png',
  'r' : 'https://www.artifactbuff.com/images/set-1-rare.png'
}

function toURL(url){
  return url.replace(/ /g,'%20')
}

class ArtifactCardsCollection{
  constructor(options,assets){
    options = options || {}
    assets = assets || {}
    this.cards = {}
    this.sets = {}
    this.assets = {}
    this.assets.rarities = assets.rarities || ''
    this.defaultLanguage = options.defaultLanguage || 'en'
    this.assets.cardtype = assets.cardtype || ''
    this.keywords = require('./artifact_keywords.json').sort((a,b) => a.name.toLowerCase() > b.name.toLowerCase())
    this.image = options.image || "https://pbs.twimg.com/profile_images/894659755129552897/-EC4LJTe_400x400.jpg"
  }
  static cardSchema(){
    return {
      name: "",
      alias : [],
      id: "",
      type: 1,
      skills: [],
      text: "",
      manacost: 0,
      goldcost: 0,
      color: "",
      attack: 0,
      armor: 0,
      health: 0,
      rarity: "",
      signature: "",
      signaturefor: "",
      getInitiative: false,
      crossLane : false
    }
  }
  addSet(setpath,language,modifier){
    language = language || this.defaultLanguage
    modifier = modifier || {}
    modifier.cards = modifier.cards || {}
    const set = require(`artifact-database/language/en/sets/${setpath}/set.json`)
    set.hosting_url = toURL(ArtifactCardsCollection.hostingUrl + "/language/" + language + '/' + set.order + ' - ' + set.name)
    set.alias = modifier.alias || []
    set.releaseDate = set.releaseDate ? ArtifactCardsCollection.getDate(set.releaseDate) : ''
    if(!this.sets[language]){this.sets[language] = []}
    if(!this.cards[language]){this.cards[language] = []}
    const set_summary = {
      name : set.name,
      alias : set.alias,
      releaseDate : set.releaseDate,
      image : set.hosting_url + '/' + set.image + '?raw=true',
      description : set.description,
      symbol : set.symbol,
      summary : {
        hero : 0,
        creep : 0,
        spell : 0,
        improvement : 0,
        weapon : 0,
        armor : 0,
        accessory : 0,
        consumible : 0
      }
    }
    const cards = fs.readdirSync(`node_modules/artifact-database/language/en/sets/${setpath}/cards`).map(f => {
      const cardDB = require(`artifact-database/language/en/sets/${setpath}/cards/${f}`)
      return Object.assign(ArtifactCardsCollection.cardSchema(),cardDB,modifier.cards[cardDB.name])
    })
    cards.sort((a,b) => a.type - b.type).forEach(card => {
      if(!card){return}
      this.addCard(card,set,language)
      set_summary.summary[ArtifactCardsCollection.cardType(card.type).toLowerCase()] += 1
    })
    set_summary.totalcards = Object.keys(set_summary.summary).map(t => set_summary.summary[t]).reduce((s,c) => s+c,0)
    this.sets[language].push(set_summary)
  }
  addCard(card,set,language){
    const re = /['`\.]/
    language = language || this.defaultLanguage
    if(!card.alias){card.alias = []}
    if(card.signaturefor){
      const signature = this.getCard(card.signaturefor,language)
      if(signature){
        [signature.name,...signature.alias].forEach(a => card.alias.push(a+_sig))
      }
    }
    // card.name = c
    card.set = set.name
    if(card.name.match(re)){card.alias.push(card.name.replace(new RegExp("['`\.]",'g'),''))}
    card.image = toURL(set.hosting_url + '/cards/' + card.id  + '.png?raw=true')
    card.releaseDate = set.releaseDate
    card.rarityIcon = toURL(set.hosting_url + '/rarities/' + ArtifactCardsCollection.rarity(card.rarity).toLowerCase() + '.png?raw=true') //set.symbols[ArtifactCardsCollection.rarity(_card.rarity).toLowerCase()] || rarities_icon[_card.rarity]
    this.cards[language].push(card)
    if(!ArtifactCardsCollection.cardType(card.type).toLowerCase()){console.log('ERROR',card.name)}
  }
  getCard(name,language){
    language = language || this.defaultLanguage
    return this.cards[language].find(card => [card.name.toLowerCase(),...card.alias.map(alias => alias.toLowerCase())].includes(name.toLowerCase()))
  }
  searchCard(text,language){
    language = language || this.defaultLanguage
    text = text.toLowerCase()
    return this.cards[language].filter(c => {
      if([c.name,c.text,c.signature,c.signaturefor].map(s => s.toLowerCase()).find(s => s.includes(text))){return true}
      if(c.skills.length && c.skills.find(s => s.text.includes(text))){return true}
    }).sort((a,b) => a.name > b.name ? 1 : -1)
  }
  getSetCards(setname,language){
    language = language || this.defaultLanguage
    return this.cards[language].filter(card => card.set.toLowerCase() === setname.toLowerCase())
  }
  getSetInfo(setname,language){
    language = language || this.defaultLanguage
    return this.sets[language].find(s => [s.name.toLowerCase(),...s.alias.map(a => a.toLowerCase())].includes(setname))
  }
  getLanguageSets(language){
    language = language || this.defaultLanguage
    return this.sets[language]
  }
  static cardType(type){
    return card_types[String(type)]
  }
  static cardTypeIcon(type){
    return card_types_icon[String(type)]
  }
  static skillType(type){
    return skills_types[String(type)]
  }
  static rarity(type){
    return rarities[String(type)] || 'Unknown'
  }
  static rarityIcon(type){
    return rarities_icon[String(type)] || 'https://www.artifactbuff.com//assets/cards/10048/art.jpg'
  }
  static cardColor(colorTag){
    if(colorTag === 'b'){return 0}
    else if(colorTag === 'g'){return 3234844} //315c1c
    else if(colorTag === 'r'){return 11534336} //B00000
    else if(colorTag === 'u'){return 28888} //0070D8
    else if(colorTag === 'y'){return 10980914} //a78e32
  }
  static assetUrl(url){
    return "https://github.com/Desvelao/artifact-database/blob/master/images"
  }
  static get hostingUrl(){
    return "https://github.com/Desvelao/artifact-assets/blob/master"
  }
  static iconsCardString(card,replacer){
    const keys = ['manacost','goldcost']
    return `${card.manacost ? `${replacer.do('<mana>')} ${card.manacost} ` : ''} ${card.goldcost ? `${replacer.do('<gold>')} ${card.goldcost} ` : ''} ${card.text.includes('Get initiative') ? '⚡' : ''}`
  }
  static getDate(datestring){
    const date = new Date(datestring)
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
  }
  sendMessageCard(msg,replacer){
    if(msg.author.bot){return}
    const query = msg.content.match(/\[([^\]]+)\]/)
    if(!query){return}
    const card = this.getCard(query[1])
    if(!card){return}
    return msg.reply({embed : {
      // title : card.name,
      author : {name : `${card.name}${(card.type === 1 || card.type === 2) ? ' - ' + card.attack + '/' + card.armor + '/' + card.health : ''}`, icon_url : ArtifactCardsCollection.cardTypeIcon(card.type), url : card.image},
      description : `${card.skills.length ? card.skills.map(s => `${s.name ? '**' + s.name + '** ' : ''}(${ArtifactCardsCollection.skillType(s.type)}${s.type === 1 ? ' CD: ' + s.cooldown : ''}) - *${s.text}*`).join('\n') + '\n': ''}${card.text ? '*' + card.text + '*\n' : ''}${card.signature && card.type === 1 ? '__**Signature Card:**__ '  + card.signature + '\n' : ''}${card.signaturefor && card.type !== 1 ? '__**Signature Card for:**__ '  + card.signaturefor + '\n' : ''}${ArtifactCardsCollection.iconsCardString(card,replacer)}${card.alias.length ? '\n**Alias:** ' + card.alias.map(a => a).join(', ') + '\n' : ''}`, //.filter(a => !a.includes(_sig))
      thumbnail : {url : card.image, height : 40, width : 40},
      footer : {icon_url: card.rarityIcon, text : `Set: ${card.set} - ${ArtifactCardsCollection.rarity(card.rarity)}`},
      color : ArtifactCardsCollection.cardColor(card.color)
    }})
  }
}

const artifactCards = new ArtifactCardsCollection({defaultLanguage : 'en'},{})

const sets_en = require('artifact-database').sets_localiced.en
Object.keys(sets_en).forEach(k =>
  artifactCards.addSet(`${k} - ${sets_en[k]}`,'en',require(`../artifact_cards/en/${k} - ${sets_en[k]}.json`))
  // artifactCards.addSet(require(`artifact-database/language/en/sets/${k} - ${sets_en[k]}/set.json`),'en',require(`../artifact_cards/en/${k} - ${sets_en[k]}.json`))
)


module.exports = artifactCards
