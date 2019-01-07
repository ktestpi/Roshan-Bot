const { Component } = require('aghanim')
// const ArtifactManager = require('../helpers/artifact')
const { Request } = require('erisjs-utils')
const modifiers = require('../containers/artifact_cards_modifiers.json')
const { encode , decode } = require('artifact-api')
const Canvas = require('../helpers/apijimp/classes/canvas')
const jimp = require('jimp')
const steamprice = require('steam-price-api')

class Artifact extends Component {
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
        this.storareDecksURL = 'https://storage.googleapis.com/roshan-bot.appspot.com/decks%2F'
        this.setsIDs = ['00','01']
        this.deckCodeBaseUrl = `https://www.playartifact.com/d/`
        this.deckCodeBaseUrlReduced = `https://playartifact.com/d/`
        this.deckCodeBaseUrlArtibuff = `https://www.artibuff.com/decks/`
        this.deckCodeBaseUrlArtibuffReduced = `https://artibuff.com/decks/`
        this.deckCodeStartsWith = 'ADC'
        this.pathStorageDecks = 'decks'
        this.appID = 583950
        this.configDeckDecoder = {
            width : 280,
            rowHeight : 28,
            imageMiniSize : 24,
            space4 : 4,
            space5: 5,
            space6 : 6,
            space10 : 10,
            space12 : 12,
            space14 : 14,
            space24 : 24,
            space28 : 28,
            imageTypeCardSize : 16,
            heroSigSize : 20,
        }
    }
    update(){
        this.sets = []
        this.cards = []
        const areCards = ['Hero','Creep','Spell','Improvement','Item']
        Promise.all(this.setsIDs.map(id => Request.getJSON(this.apiURL + id)
            .then(response => Request.getJSON((response.cdn_root + response.url).replace('\\','')))))
            .then(responses => {
                responses.forEach(response => {
                    // Set signature into references field
                    const set = {
                        name: response.card_set.set_info.name,
                        id : response.card_set.set_info.set_id,
                        totalCards : 0,
                        summary : {
                            hero : 0,
                            creep : 0,
                            spell : 0,
                            improvement : 0,
                            weapon : 0,
                            armor : 0,
                            accessory : 0,
                            consumable : 0
                        }
                    }
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
                        set.summary[Artifact.cardType(cardresponse).toLowerCase()]++
                        set.totalCards++
                        // console.log(card)
                    })
                    this.addSet(set)
                })
                this.cards = this.cards.map(card => {
                    if (card.signatureCardFor){
                        const heroCard = this.getCardByName(card.signatureCardFor.english)
                        if(heroCard){
                            card.aliasExtended = [heroCard.name.english, ...heroCard.alias].map(name => name + this.suffixSig)
                        }
                    }
                    return card
                })
                console.log('Total cards:',this.cards.length)
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
        return [] // Removed Abilities to show
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
        const signatureCardFor = parseSignatureCardFor.find(c => {
            const card = Artifact.getCardByID(c.card_id, dataset)
            return card ? card.card_type === 'Hero' : false
        })
        if (!signatureCardFor){ return }
        return Artifact.getCardByID(signatureCardFor.card_id, dataset).card_name
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
    static getCardRarityUrl({rarity, setID}){
        rarity = rarity || 'common'
        return `https://raw.githubusercontent.com/Open-Artifact/artifactdb-set-${setID}/master/assets/sets/set-${setID}/symbol/${rarity.toLowerCase()}.png`
        // return `https://github.com/Open-Artifact/artifactdb-set-${setID}/blob/master/assets/sets/set-${setID}/symbol/${rarity.toLowerCase()}.png?raw=true`
    }
    static getAlias(data, dataset, modifiers){
        const re = /['!`\.]/g
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
            .replace(new RegExp('<BR>','gi'),'\n')
            .replace(new RegExp('<br/>','gi'),'\n')
            .replace(new RegExp('\n\n','g'),'\n')
    }
    static removeTextWithAbilities(data){
        // if (data.references.filter(r => ['active_ability','passive_ability'].includes(r.ref_type)).length){
        //     return {}
        // }
        return Artifact.clearHTMLTagsObj(data.card_text)
    }
    static createCard(data, dataset){
        return {
            id: data.card_id,
            cardType: Artifact.cardType(data),
            name: data.card_name,
            text: Artifact.removeTextWithAbilities(data),
            imageMini: data.mini_image,
            imageLarge: data.large_image,
            imageIngame: data.ingame_image,
            illustrator: data.illustrator || '',
            rarity: data.rarity || '',
            color: Artifact.getCardColor(data),
            attack: data.attack || 0,
            armor: data.armor || 0,
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
        return this.sets.find(set => set.name.english.toLowerCase() === name.toLowerCase())
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
    renderCardMessage(msg, card, replacer, data){
        return msg.reply({
            embed: {
                // title : card.name,
                author: {
                    name: `${card.name.english}${["Hero", "Creep"].includes(card.cardType) ? ' - ' + card.attack + '/' + card.armor + '/' + card.health : ''}`,
                    icon_url: Artifact.getCardTypeUrl(card),
                    url: card.imageLarge.default
                },
                description: `${card.abilities.length ? card.abilities.map(s => `${s.name.english ? '**' + s.name.english + '** ' : ''}(${s.type}${s.type === "Active" ? ' CD: ' + s.cooldown : ''}) - *${s.text.english}*`).join('\n') + '\n' : ''}${card.text.english ? '*' + card.text.english + '*\n' : ''}${card.signatureCard && card.cardType === "Hero" ? '__**Signature Card:**__ ' + card.signatureCard.english + '\n' : ''}${card.signatureCardFor && card.cardType !== 1 ? '__**Signature Card for:**__ ' + card.signatureCardFor.english + '\n' : ''}${Artifact.iconsCardString(card, replacer)}${[...card.alias, ...card.aliasExtended].length ? '\n**Alias:** ' + [...card.alias, ...card.aliasExtended].map(a => a).join(', ') + '\n' : ''}${data ? `\n[:moneybag:](https://steamcommunity.com/market/listings/${this.appID}/1${card.id}) ${data.body.lowest_price}`: ``}`, //.filter(a => !a.includes(_sig))
                thumbnail: { url: card.imageLarge.default, height: 40, width: 40 },
                footer: { icon_url: Artifact.getCardRarityUrl(card), text: `Set: ${card.setName.english} - ${card.rarity}` },
                color: Artifact.cardColor(card)
            }
        })
    }
    renderCard(msg, card, replacer) {
        return this.getCardPrice(card.name.english)
            .then(data => this.renderCardMessage(msg,card,replacer,data))
            .catch(err => this.renderCardMessage(msg, card, replacer))
    }
    generateElementsDeckCode(code){
        const decoded = this.deckDecode(code)
        // ;[decoded.heroes]
    }
    deckCodeUrl(code){
        return `${this.deckCodeBaseUrl}${code}`
    }
//     {
//     name: 'Green/Black Example',
//         heroes:
//     [{ turn: 2, id: 4005 },
//     { turn: 1, id: 10014 },
//     { turn: 3, id: 10017 },
//     { turn: 1, id: 10026 },
//     { turn: 1, id: 10047 }],
//         cards:
//     [{ count: 2, id: 3000 },
//     { count: 1, id: 3001 },
//     { count: 3, id: 10091 },
//     { count: 3, id: 10102 },
//     { count: 3, id: 10128 },
//     { count: 3, id: 10165 },
//     { count: 3, id: 10168 },
//     { count: 3, id: 10169 },
//     { count: 3, id: 10185 },
//     { count: 1, id: 10223 },
//     { count: 3, id: 10234 },
//     { count: 1, id: 10260 },
//     { count: 1, id: 10263 },
//     { count: 3, id: 10322 },
//     { count: 3, id: 10354 }]
// }
    generateDeck(code, alias){
        try{
            const mainDeckTypes = ['Creep', 'Spell', 'Improvement']
            const itemDeckTypes = ['Weapon', 'Armor', 'Accessory', 'Consumable']
            let decoded = this.deckDecode(code)
            if(!decoded){ throw new Error(`Error in decoding deck: ${code}`)}
            if(alias && decoded.name !== alias){
                decoded.name = alias
                const oldcode = code
                code = this.deckEncode(decoded)
                if (!code) { throw new Error(`Error in new code: ${oldcode}`) }
                decoded = this.deckDecode(code)
                if (!decoded) { throw new Error(`Error in decoding deck: ${code}`) }
            }
            const cardsDeck = [...decoded.heroes.sort((a, b) => a.turn - b.turn), ...decoded.cards, ...decoded.heroes.map(card => ({ id : this.cards.find(signatureCard => signatureCard.name.english === this.getCardByID(card.id).signatureCard.english).id , count : 3}))]
                .map(card => ({ card: this.getCardByID(card.id), turn : card.turn || 0, count : card.count || 1})) // Todo ordenar por coste y colores
            
            const sorting_info = [
                {
                    filter : el => el.card.cardType === 'Hero',
                    sort : (el1,el2) => el1.turn - el2.turn
                }, {
                    filter: el => mainDeckTypes.includes(el.card.cardType),
                    sort: (el1, el2) => {
                        const manaCostDiff = el1.card.manaCost - el2.card.manaCost
                        if (manaCostDiff === 0){
                            if (el1.card.name.english > el2.card.name.english){return 1}
                            return -1
                        }
                        return manaCostDiff
                    }
                }, {
                    filter: el => itemDeckTypes.includes(el.card.cardType),
                    sort: (el1, el2) => {
                        const goldCostDiff = el1.card.goldCost - el2.card.goldCost
                        if (goldCostDiff === 0) {
                            if (el1.card.name.english > el2.card.name.english) { return 1 }
                            return -1
                        }
                        return goldCostDiff
                    }
                }
    
            ]
            const orderedDeck = sorting_info.reduce((sum,sortMethod) => {
                return [...sum,...cardsDeck.filter(sortMethod.filter).sort(sortMethod.sort)]
            },[])
            const jimps = [
                new jimp(this.configDeckDecoder.width, cardsDeck.length * this.configDeckDecoder.rowHeight),
                Promise.all([jimp.loadFont(jimp.FONT_SANS_8_WHITE), jimp.loadFont(jimp.FONT_SANS_16_WHITE)]),
                Promise.all(Object.keys(Artifact.hexColors).map(bg => new jimp(this.configDeckDecoder.width, this.configDeckDecoder.rowHeight, Artifact.hexColors[bg]))),
                Promise.all(orderedDeck.map(el => {return Promise.all([
                    jimp.read(el.card.imageMini.default), // Image 0
                    el.card.name.english, // Name 1
                    el.card.cardType, // cardType 2
                    el.turn, // Turn 3
                    el.count, // Count 4
                    jimp.read(Artifact.getCardTypeUrl(el.card)), // typeCard 5
                    jimp.read(Artifact.getCardRarityUrl(el.card)), // symbol 6
                    el.card.manaCost || el.card.goldCost, // Cost 7
                    el.card.color,  // Color 8
                    el.card.signatureCardFor ? jimp.read(this.getCardByName(el.card.signatureCardFor.english).imageIngame.default) : null
                ])})),
            ]
            return Promise.all(jimps).then(data => {
                const canvas = new Canvas(data[0], {w8 : data[1][0], w16 : data[1][1]})
                data[3].forEach((el,index) => {
                    const ref = canvas.ref('row' + index, { x: 0, y: index * this.configDeckDecoder.rowHeight, w: this.configDeckDecoder.width, h: this.configDeckDecoder.rowHeight})
                    const cardBg = canvas.paint(`bg${index}`, data[2][Object.keys(Artifact.hexColors).indexOf(el[8])]).set(ref, 'cy')
                    const imageMini = canvas.paint(`icon${index}`, el[0].resize(this.configDeckDecoder.rowHeight, jimp.AUTO)).place(ref, 'cy').set(ref, 'lx', { x: 0 })//.set(ref, 'lx', { x: this.configDeckDecoder.space4})
                    // const costCard = canvas.write('costCard',el[5],'w16').place(imageMini,'rx',{x : 10}).set(ref,'cy')
                    const imageTypeCard = canvas.paint(`cardtype${index}`, el[5].resize(this.configDeckDecoder.imageTypeCardSize, jimp.AUTO)).set(imageMini, 'rxcy', { x: this.configDeckDecoder.space4})
                    const cardName = canvas.write('cardName', el[1], 'w16').place(imageTypeCard, 'rx', { x: this.configDeckDecoder.space24}).set(ref,'cy')
                    if(index < 5){
                        const heroTurn = canvas.write('heroTurn', `R${el[3]}`, 'w16').set(ref, 'gxrcy', { x: this.configDeckDecoder.space4 })
                        // const cardSymbol = canvas.paint(`cardSymbol${index}`, el[6].resize(12, jimp.AUTO)).set(heroTurn, 'gxlcy', {x : -16})
                    }else if( index > 4){
                        const cardCost = canvas.write('cardCost', `${el[7]}`, 'w16').place(imageTypeCard, 'rxcy', { x: this.configDeckDecoder.space12}).set(null,'csx')
                        const cardCount = canvas.write('cardCount', `x${el[4]}`, 'w16').set(ref, 'gxrcy', { x: this.configDeckDecoder.space4 })
                        if(el[9]){
                            // console.log(el[9])
                            const heroSig = canvas.paint(`heroSig${index}`, el[9].resize(this.configDeckDecoder.heroSigSize, jimp.AUTO)).set(cardCount, 'gxlcy', { x: -24 })
    
                        }
                        // const cardSymbol = canvas.paint(`cardSymbol${index}`, el[6].resize(12, jimp.AUTO)).set(cardCount, 'gxlcy', { x: -16 })
                    }
                })
                return canvas.create('png').then((buffer) => ({ buffer, data: { code, name: decoded.name, deckUrl: this.deckCodeUrl(code)}}))
            })
        }catch(err){
            return Promise.reject(err)
        }
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
            Black: 0x736e80,
            Blue: 0x2f7492,
            Green: 0x479036,
            Red: 0xc2352d,
            Yellow: 10980914
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
    isValidDeckCode(string){
        if(string.startsWith(this.deckCodeBaseUrl)){
            return string.replace(this.deckCodeBaseUrl,'')
        } else if (string.startsWith(this.deckCodeBaseUrlReduced)) {
            return string.replace(this.deckCodeBaseUrlReduced, '')
        } else if (string.startsWith(this.deckCodeBaseUrlArtibuff)) {
            return string.replace(this.deckCodeBaseUrlArtibuff, '')
        } else if (string.startsWith(this.deckCodeBaseUrlArtibuffReduced)) {
            return string.replace(this.deckCodeBaseUrlArtibuffReduced, '')
        } else if(string.startsWith(this.deckCodeStartsWith)){
            return string
        }
        return false
    }
    ready(){
        this.update()
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
    uploadBufferDeck(buffer,code){
        return new Promise((res, rej) => {
            const file = this.client.storage.file(`${this.pathStorageDecks}/${code}.jpg`)
            file.createWriteStream({ contentType : 'image/jpeg', public: true })
                .on('error', (err) => { rej(err)})
                .on('finish', (...val) => {
                    file.get().then(([f, r]) => {
                        // console.log(f)
                        // console.log('------------------')
                        // console.log(r)
                        // console.log('------------------')
                        res(`${this.storareDecksURL}${code}.jpg`)
                        // res(r.mediaLink)
                    })
                })
                .end(buffer)
        })
    }
    saveDeckIntoCache(code,name,author,url){
        // return { name, author, url, ts: new Date(), _id: code}
        return this.client.cache.decks.save(code, { name, author, url, ts : new Date() })
    }
    uploadDeckAndCache(buffer,code,name,author){
        return this.uploadBufferDeck(buffer, code).then(url => this.saveDeckIntoCache(code,name,author,url))
    }
    uploadDeckAndCacheDiscord(msg,code,name,author,url){
        
    }
    getCachedDeck(search){
        return this.client.cache.decks.find(deck => [deck._id,deck.name].map(s => s.toLowerCase()).includes(search.toLowerCase()))
    }
    findCachedDeckByName(search) {
        return this.client.cache.decks.find(deck => deck.name.toLowerCase().includes(search.toLowerCase()))
    }
    findAllCachedDeckByName(search) {
        return this.client.cache.decks.filter(deck => deck.name.toLowerCase().includes(search.toLowerCase()))
    }
    getCardPrice(cardname){
        return new Promise((res, rej) => {
            const card = this.getCardByName(cardname)
            if(!card){rej(new Error(`Card doesn't exist: ${cardname}`))}
            steamprice.getprice(this.appID, `1${card.id}`, (err, data) => {
                !err ? res(data) : rej(err)
            } , 3) // 1 = USD, 2 = GB, 3 = EUR
        })
    }
}

Artifact.colors = {
    BLUE : 'Blue',
    BLACK : 'Black',
    GREEN : 'Green',
    RED : 'Red',
    YELLOW : "Yellow"
}

// Artifact.hexColors = {
//     Blue: 0x2f7492ff,
//     Black: 0x736e80ff,
//     Green: 0x479036ff,
//     Red: 0xc2352dff,
//     Yellow: 10980914,
//     White: 0x0000ffff
// }

Artifact.hexColors = {
    Blue: 0x255C74ff,
    Black: 0x393740ff,
    Green: 0x316425ff,
    Red: 0x9b2a24ff,
    Yellow: 0x8c7f0cff,
    White: 0x0000ffff
}

module.exports = Artifact