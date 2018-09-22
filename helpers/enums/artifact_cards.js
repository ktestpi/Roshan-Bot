const card_types = require('artifact-database/constants/cards_types.json')
const skills_types = require('artifact-database/constants/skills_types.json')
const rarities = require('artifact-database/constants/rarities.json')
const cards_colors = require('artifact-database/constants/cards_colors.json')

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
  '1' : 'https://github.com/Desvelao/artifact-database/blob/master/assets/cards_types/hero.png?raw=true',
  '2' : 'https://github.com/Desvelao/artifact-database/blob/master/assets/cards_types/creep.png?raw=true',
  '3' : 'https://github.com/Desvelao/artifact-database/blob/master/assets/cards_types/spell.png?raw=true',
  '4' : 'https://github.com/Desvelao/artifact-database/blob/master/assets/cards_types/improvement.png?raw=true',
  '5' : 'https://github.com/Desvelao/artifact-database/blob/master/assets/cards_types/weapon.png?raw=true',
  '6' : 'https://github.com/Desvelao/artifact-database/blob/master/assets/cards_types/armor.png?raw=true',
  '7' : 'https://github.com/Desvelao/artifact-database/blob/master/assets/cards_types/accessory.png?raw=true',
  '8' : 'https://github.com/Desvelao/artifact-database/blob/master/assets/cards_types/consumible.png?raw=true'
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
    this.keywords = require('./artifact_keywords.json')
    this.image = options.image || "https://pbs.twimg.com/profile_images/894659755129552897/-EC4LJTe_400x400.jpg"
  }
  addSet(set,language){
    language = language || this.defaultLanguage
    set.hosting_url = toURL(ArtifactCardsCollection.hostingUrl + "/language/" + language + '/' + set.order + ' - ' + set.name)
    set.cards.forEach(card => {
      const _card = card
      _card.set = set.name
      _card.image = toURL(set.hosting_url + '/cards/' + _card.image + '?raw=true')
      _card.launched = set.launched
      _card.rarityIcon = toURL(set.hosting_url + '/rarities/' + ArtifactCardsCollection.rarity(_card.rarity).toLowerCase() + '.png?raw=true') //set.symbols[ArtifactCardsCollection.rarity(_card.rarity).toLowerCase()] || rarities_icon[_card.rarity]
      if(!this.cards[language]){this.cards[language] = []}
      this.cards[language].push(_card)
    })
    if(!this.sets[language]){this.sets[language] = []}
    this.sets[language].push({name : set.name, alias : set.alias, launched : set.launched, totalcards : set.cards.length, image : set.hosting_url + '/' + set.image + '?raw=true', description : set.description, symbols : set.symbols,
      summary : {
        hero : set.cards.filter(c => c.type === 1).length,
        creep : set.cards.filter(c => c.type === 2).length,
        spell : set.cards.filter(c => c.type === 3).length,
        improvement : set.cards.filter(c => c.type === 4).length,
        weapon : set.cards.filter(c => c.type === 5).length,
        armor : set.cards.filter(c => c.type === 6).length,
        accessory : set.cards.filter(c => c.type === 7).length,
        consumible : set.cards.filter(c => c.type === 8).length
      }
    })
  }
  getCard(name,language){
    language = language || this.defaultLanguage
    return this.cards[language].find(card => [card.name.toLowerCase(),...card.alias.map(alias => alias.toLowerCase())].includes(name.toLowerCase()))
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
    return "https://github.com/Desvelao/artifact-database/blob/master"
  }
  static iconsCardString(card,replacer){
    const keys = ['manacost','goldcost']
    return `${card.manacost ? `${replacer.do('<mana>')} ${card.manacost} ` : ''} ${card.goldcost ? `${replacer.do('<gold>')} ${card.goldcost} ` : ''} ${card.text.includes('Get initiative') ? '⚡' : ''}`
  }
  sendMessageCard(msg,replacer){
    if(msg.author.bot){return}
    const query = msg.content.match(/\[([^\]]+)\]/)
    if(!query){return}
    const card = this.getCard(query[1])
    if(!card){return}
    return msg.reply({embed : {
      // title : card.name,
      author : {name : card.name, icon_url : ArtifactCardsCollection.cardTypeIcon(card.type), url : card.image},
      description : `${(card.type === 1 || card.type === 2) ? '**Stats:** ' + card.attack + '/' + card.armor + '/' + card.health + '\n': ''}${card.skills.length ? '**Skills:** ' + card.skills.map(s => `__(${ArtifactCardsCollection.skillType(s.type)}${s.type === 1 ? ' CD: ' + s.cooldown : ''})__ - \`${s.text}\``).join('\n') + '\n': ''}${card.text ? '**Text:** ' + card.text + '\n' : ''}${card.signature && card.type === 1 ? '**Signature Card:** '  + card.signature + '\n' : ''}${card.signaturefor && card.type !== 1 ? '**Signature Card for:** '  + card.signaturefor + '\n' : ''}${ArtifactCardsCollection.iconsCardString(card,replacer)}${card.alias.length ? '**Alias:** ' + card.alias.map(a => a).join(', ') + '\n' : ''}`,
      thumbnail : {url : card.image, height : 40, width : 40},
      footer : {icon_url: card.rarityIcon, text : `Set: ${card.set} - Rarity: ${ArtifactCardsCollection.rarity(card.rarity)}`},
      color : ArtifactCardsCollection.cardColor(card.color)
    }})
  }
}

const artifactCards = new ArtifactCardsCollection({defaultLanguage : 'en'},{})

artifactCards.addSet(require('artifact-database/language/en/0 - Basic/db.json'))
artifactCards.addSet(require('artifact-database/language/en/1 - Starter/db.json'))

module.exports = artifactCards
