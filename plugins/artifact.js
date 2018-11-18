const { Plugin } = require('aghanim')
// const ArtifactManager = require('../helpers/artifact')
const { Request } = require('erisjs-utils')
const modifiers = require('../containers/artifact_cards_modifiers.json')
const { encode , decode } = require('artifact-api')

module.exports = class Artifact extends Plugin {
    constructor(client, options) {
        super(client)
        // this.client.artifact = new ArtifactManager()
        this.cards = []
        this.sets = []
        this.cardsURL = 'https://raw.githubusercontent.com/ottah/ArtifactDB/master/cards-manifest.json'
        this.modifiers = modifiers
        this.suffixSig = ':sig'
        this.logo = 'https://pbs.twimg.com/profile_images/1042522926971383808/z9w_YpHG_normal.jpg'
        this.keywords = require('../enums/artifact_keywords.json')
        this.apiURL = 'https://playartifact.com/cardset/'
        this.setsIDs = ['00','01']
    }
    update() {
        return Request.getJSON(this.cardsURL).then(data => {
            const sets = data.Sets
            sets.forEach(dataset => {
                const set = {
                    Name: dataset.Name,
                    Release: Artifact.getDate(dataset.ReleaseDate),
                    TotalCards: 0,
                    Summary: {
                        Hero: 0,
                        Creep: 0,
                        Spell: 0,
                        Improvement: 0,
                        Weapon: 0,
                        Armor: 0,
                        Accessory: 0,
                        Consumible: 0
                    }
                }
                const re = /['`\.]/g

                dataset.Cards = dataset.Cards.map(card => {
                    card = Object.assign(Artifact.cardSchema(), card)
                    const modifier = this.modifiers[card.Name]
                    if (modifier) {
                        card = Object.assign(card, modifier)
                    }
                    card.Alias = card.Alias || []
                    if (re.test(card.Name)) {
                        card.Alias.push(card.Name.replace(re, ""))
                    }
                    card.AliasExtended = []
                    card.ImageURL = `https://github.com/ottah/ArtifactDB/blob/master/assets/fullcard/${card.FileName}.png?raw=true`
                    card.CardTypeURL = Artifact.cardTypeURL(card)
                    card.RarityURL = Artifact.rarityURL(card)
                    card.Set = set.Name
                    card.Release = set.Release
                    return card
                })

                dataset.Cards.forEach(card => {
                    if (card.SignatureCard) {
                        const signatureCard = dataset.Cards.find(c => c.Id === card.SignatureCard)
                        if (signatureCard) {
                            card.SignatureCardName = signatureCard.Name
                        }
                    } else if (card.IsSignatureCard) {
                        const isSignatureCard = dataset.Cards.find(c => c.SignatureCard === card.Id)
                        if (isSignatureCard) {
                            card.IsSignatureCardName = isSignatureCard.Name
                            ;[isSignatureCard.Name, ...isSignatureCard.Alias].forEach((alias, index) => card.AliasExtended.push(alias + this.suffixSig))
                        }
                    }
                    this.addCard(card)
                    set.Summary[Artifact.cardType(card)]++
                    set.TotalCards++
                })
                this.addSet(set)
            })
        })
    }
    updateNew(){
        // const urls = ['artifactdb-set-0', 'artifactdb-set-1'].map((url, index) => `https://raw.githubusercontent.com/Open-Artifact/${url}/master/assets/sets/set-${index}/set.json`)
        const areCards = ['Hero','Creep','Spell','Improvement','Item']
        Promise.all(this.setsIDs.map(id => Request.getJSON(this.apiURL + id)
            .then(response => Request.getJSON((response.cdn_root + response.url).replace('\\','')))))
            .then(responses => {
                responses.forEach(response => {
                    // Set signature into references field
                    response.card_set.card_list.filter(card => card.card_type === 'Hero').forEach(card => {
                        const refSignatureCard = card.references.find(r => r.ref_type === 'includes')
                        if (refSignatureCard){
                            const signatureCard = response.card_set.card_list.find(c => c.card_id === refSignatureCard.card_id)
                            if (signatureCard){
                                // console.log(signatureCard.card_name.english)
                                signatureCard.references.push({card_id : card.card_id, ref_type : 'references'})
                                signatureCard.rarity = card.rarity
                            }
                        }
                    })
                    const cardsresponse = response.card_set.card_list
                    cardsresponse.forEach(cardresponse => {
                        if (!areCards.includes(cardresponse.card_type)){ return }
                        const card = Artifact.createCard(cardresponse, response.card_set)
                        this.addCard(card)
                        // console.log(card)
                    })
                })
                console.log('Total cards:',this.cards.length)
                this.cards = this.cards.map(card => {
                    if (card.signatureCardFor){
                        const heroCard = this.getCardByName(card.signatureCardFor.english)
                        if(heroCard){
                            card.aliasExtended = [heroCard.name.english, ...heroCard.alias].map(name => name + this.suffixSig)
                        }
                    }
                    return card
                })
        })
    }
    getCardByID(id){
        return this.cards.find(c => c.id === id)
    }
    getCardByName(name) {
        return this.cards.find(c => c.name.english === name)
    }
    static getCardColor(data){
        if(data.is_blue){return "Blue"}
        else if(data.is_green){return "Green"}
        else if(data.is_red){return "Red"}
        else if(data.is_black){return "Black"}
        else if(data.card_type === 'Item'){return "Yellow"}
        else{return ''}
    }
    static getCardByID(id, data){
        return data.find(c => c.card_id === id)
    }
    static getCardType(data){
        
    }
    static getReference(id, data){
        return data.find(c => c.card_id === id)
    }
    static parseReferences(data, ref){
        ref = Array.isArray(ref) ? ref : [ref]
        return data.references.filter(r => ref.includes(r.ref_type))
    }
    static getAbilityData(id, dataset){
        const data = Artifact.getCardByID(id, dataset)
    }
    static getReferenceAbilities(data, dataset){
        const abilities = Artifact.parseReferences(data, ['active_ability','passive_ability'])
        return abilities.map(ability => {
            const abilityCard = Artifact.getCardByID(ability.card_id, dataset)
            return {
                type : abilityCard.card_type,
                name : abilityCard.card_name,
                text : Artifact.clearHTMLTagsObj(abilityCard.card_text)
            }
        })
    }
    static getReferenceSignatureCard(data, dataset){
        const parseSignatureCard = Artifact.parseReferences(data, ['includes'])
        if( !parseSignatureCard.length ) { return }
        const signatureCard = Artifact.getCardByID(parseSignatureCard[0].card_id, dataset)
        return signatureCard.card_name
    }
    static getReferenceSignatureCardFor(data, dataset) {
        const parseSignatureCardFor = Artifact.parseReferences(data, ['references'])
        if (!parseSignatureCardFor.length) { return }
        const signatureCardFor = Artifact.getCardByID(parseSignatureCardFor[0].card_id, dataset)
        if (!signatureCardFor || signatureCardFor.card_type !== 'Hero'){ return }
        return signatureCardFor.card_name
    }
    static getAliasExtended(data, dataset){
        const aliasExtended = []
        const signatureCardFor = Artifact.getReferenceSignatureCardFor(data,dataset)
        if (signatureCardFor) { aliasExtended.push(signatureCardFor.english)}
        return aliasExtended
    }
    static getCardTypeUrl({cardType}){
        return `https://github.com/Open-Artifact/artifactdb-ui/blob/master/assets/${cardType.toLowerCase()}-icon.png?raw=true`
    }
    static getCardRarityUrl({rarity , setID}){
        return `https://github.com/Open-Artifact/artifactdb-set-${setID}/blob/master/assets/sets/set-${setID}/symbol/${rarity.toLowerCase()}.png?raw=true`
    }
    static getAlias(data, dataset, modifiers){
        const re = /['`\.]/g
        const alias = []
        if (modifiers[data.card_name.english] && modifiers[data.card_name.english].alias){
            modifiers[data.card_name.english].alias.forEach(a => alias.push(a))
        }
        if (re.test(data.card_name.english)) {
            alias.push(data.card_name.english.replace(re, ""))
        }
        return alias
    }
    static clearHTMLTagsObj(obj) {
        return Object.keys(obj).reduce((sum, cur) => {
            sum[cur] = Artifact.clearHTMLTags(obj[cur])
            return sum
        },{})
    }
    static clearHTMLTags(text){
        // console.log('TEXT',text)
        return text.replace(new RegExp(`<span style=\'font-weight:bold;color:#ffffff;\'>`,'g'), '')
            .replace(new RegExp(`<span style='font-weight:bold;color:#c2352d;'>`,'g'),'')
            .replace(new RegExp(`<span style='font-weight:bold;color:#479036;'>`,'g'),'')
            .replace(new RegExp(`<span style='font-weight:bold;color:#2f7492;'>`,'g'),'')
            .replace(new RegExp(`<span style='font-weight:bold;color:#736e80;'>`,'g'),'')
            .replace(new RegExp('</span>','g'),'')
            .replace(new RegExp('<BR>','g'),'\n')
            .replace(new RegExp('<br/>','g'),'\n')
    }
    static createCard(data, dataset){
        return {
            id: data.card_id,
            cardType: Artifact.cardType(data),
            name: data.card_name,
            text: Artifact.clearHTMLTagsObj(data.card_text),
            imageMini: data.mini_image,
            imageLarge: data.large_image,
            imageIngame: data.ingame_image,
            illustrator: data.illustrator || '',
            rarity: data.rarity || '',
            color: Artifact.getCardColor(data),
            attack: data.attack || 0,
            armor: data.amor || 0,
            health: data.hit_points || 0,
            abilities: Artifact.getReferenceAbilities(data, dataset.card_list),
            alias: Artifact.getAlias(data, dataset.card_list, modifiers),
            aliasExtended: [],
            manaCost: data.mana_cost || 0,
            goldCost: data.gold_cost || 0,
            signatureCard: Artifact.getReferenceSignatureCard(data, dataset.card_list),
            signatureCardFor: Artifact.getReferenceSignatureCardFor(data, dataset.card_list),
            crossLane: false,
            getInitiative: false,
            charges: 0,
            setName: dataset.set_info.name,
            setID: dataset.set_info.set_id,
            releaseDate: ''
        }
    }
    addCard(card) {
        this.cards.push(card)
    }
    addSet(set) {
        this.sets.push(set)
    }
    getCard(name) {
        return this.cards.find(card => [card.name.english.toLowerCase(), ...card.alias.map(alias => alias.toLowerCase()), ...card.aliasExtended.map(alias => alias.toLowerCase())].includes(name.toLowerCase()))
    }
    getSet(name) {
        return this.sets.find(set => set.name.default.toLowerCase() === name.toLowerCase())
    }
    searchCard(text) {
        text = text.toLowerCase()
        return this.cards.filter(c => {
            if ([c.name.english, c.text.english ? c.text.english : '', c.signatureCard ? c.signatureCard.english : '', c.signatureCardFor ? c.signatureCardFor.english : ''].map(s => s.toLowerCase()).find(s => s.includes(text))) { return true }
            if (c.abilities.length && c.abilities.find(s => s.text.english.includes(text))) { return true }
        }).sort((a, b) => a.name.english > b.name.english ? 1 : -1)
    }
    parseMessage(msg, replacer) {
        if (msg.author.bot) { return }
        const query = msg.content.match(/\[([^\]]+)\]/g)
        if (!query || !query.length) { return }
        let limit = 0
        const cards = []
        query.reduce((cards, q) => {
            const search = q.match(/\[([^\]]+)]/)
            const card = this.getCard(search[1])
            if (!card || cards.length > 2) { return cards }
            cards.push(card)
            return cards
        }, []).forEach(card => this.renderCard(msg, card, replacer))
    }
    renderCard(msg, card, replacer) {
        console.log(card)
        console.log(Artifact.getCardTypeUrl(card))
        return msg.reply({
            embed: {
                // title : card.name,
                author: {
                    name: `${card.name.english}${["Hero", "Creep"].includes(card.cardType) ? ' - ' + card.attack + '/' + card.armor + '/' + card.health : ''}`,
                    icon_url: Artifact.getCardTypeUrl(card),
                    url: card.imageLarge.default
                },
                description: `${card.abilities.length ? card.abilities.map(s => `${s.name.english ? '**' + s.name.english + '** ' : ''}(${s.type}${s.type === "Active" ? ' CD: ' + s.cooldown : ''}) - *${s.text.english}*`).join('\n') + '\n' : ''}${card.text.english ? '*' + card.text.english + '*\n' : ''}${card.signatureCard && card.cardType === "Hero" ? '__**Signature Card:**__ ' + card.signatureCard.english + '\n' : ''}${card.signatureCardFor && card.cardType !== 1 ? '__**Signature Card for:**__ ' + card.signatureCardFor.english + '\n' : ''}${Artifact.iconsCardString(card, replacer)}${[...card.alias, ...card.aliasExtended].length ? '\n**Alias:** ' + [...card.alias, ...card.aliasExtended].map(a => a).join(', ') + '\n' : ''}`, //.filter(a => !a.includes(_sig))
                thumbnail: { url: card.imageLarge.default, height: 40, width: 40 },
                footer: { icon_url: Artifact.getCardRarityUrl(card), text: `Set: ${card.setName.english} - ${card.rarity}` },
                color: Artifact.cardColor(card)
            }
        })
    }
    static cardTypeURL(card) {
        const result = Artifact.cardType(card)
        return `https://github.com/ottah/ArtifactDB/blob/master/assets/icon/${result.toLowerCase()}.png?raw=true`
    }
    static rarityURL({ Rarity }) {
        return `https://github.com/ottah/ArtifactDB/blob/master/assets/icon/base_rarity/${Rarity.toLowerCase()}.png?raw=true`
    }
    static cardType({ card_type , sub_type }) {
        return card_type !== 'Item' ? card_type : sub_type
    }
    static cardColor({ color }) {
        const colors = {
            Black: 1, // 0x000000,
            Blue: 28888, //0x0000ff,
            Green: 3234844, //0x00ff00,
            Red: 11534336, // 0xff0000
            Yellow: 10980914 //
        }
        return colors[color] || 0xFFFFFF
    }
    static iconsCardString(card, replacer) {
        const keys = ['manacost', 'goldcost']
        return `${card.manaCost ? `${replacer.replacer('<mana>')} ${card.manaCost} ` : ''} ${card.goldCost ? `${replacer.replacer('<gold>')} ${card.goldCost} ` : ''} ${card.getInitiative ? '⚡' : ''} ${card.crossLane ? '<>' : ''}`
    }
    static getDate(datestring) {
        const date = new Date(datestring)
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }
    static cardSchema() {
        return {
            Name: '',
            Id: '',
            CardType: '',
            ItemType: '',
            Abilities: [],
            Text: '',
            ManaCost: 0,
            GoldCost: 0,
            Color: '',
            Attack: 0,
            Armor: 0,
            Health: 0,
            Rarity: '',
            SignatureCard: false,
            IsSignatureCard: false,
            Charges: 0,
            Artist: '',
            Lore: '',
            CrossLane: false,
            GetInitiative: false,
            Token: false,
            fileName: '',
            RelatedIds: [],
            Alias: [],
            AliasExtended: [],
            SignatureCardName: '',
            IsSignatureCardName: ''
        }
    }
    ready(){
        // this.update()
        this.updateNew()
    }
    messageCreate(msg){
        this.parseMessage(msg, this.client.locale)
    }
    deckEncode(deck){
        return encode(deck)
    }
    deckDecode(deckString){
        return decode(deckString)
    }
}
