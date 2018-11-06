const { Request } = require('erisjs-utils')
const modifiers = require('../containers/artifact_cards_modifiers.json')

class ArtifactManager{
    constructor(){
        this.cards = []
        this.sets = []
        this.cardsURL = 'https://raw.githubusercontent.com/ottah/ArtifactDB/master/cards-manifest.json'
        this.modifiers = modifiers
        this.suffixSig = ':sig'
    }
    update(){
        return Request.getJSON(this.cardsURL).then(data => {
            const sets = data.Sets
            sets.forEach(dataset => {
                const set = {
                    Name : dataset.Name,
                    Release : ArtifactManager.getDate(dataset.ReleaseDate),
                    TotalCards : 0,
                    Summary : {
                        Hero : 0,
                        Creep : 0,
                        Spell : 0,
                        Improvement : 0,
                        Weapon : 0,
                        Armor : 0,
                        Accessory : 0,
                        Consumible : 0
                    }
                }
                const re = /['`\.]/g

                dataset.Cards = dataset.Cards.map(card => {
					card = Object.assign(ArtifactManager.cardSchema(), card)
                    const modifier = this.modifiers[card.Name]
                    if (modifier) {
						card = Object.assign(card, modifier)
                    }
                    card.Alias = card.Alias || []
                    if (re.test(card.Name)) {
                        card.Alias.push(card.Name.replace(re,""))
                    }
                    card.AliasExtended = []
                    card.ImageURL = `https://github.com/ottah/ArtifactDB/blob/master/assets/fullcard/${card.fileName}.png?raw=true`
                    card.CardTypeURL = ArtifactManager.cardTypeURL(card)
                    card.RarityURL = ArtifactManager.rarityURL(card)
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
                    }else if(card.IsSignatureCard){
                        const isSignatureCard = dataset.Cards.find(c => c.SignatureCard === card.Id)
                        if (isSignatureCard) {
                            card.IsSignatureCardName = isSignatureCard.Name
                            ;[isSignatureCard.Name, ...isSignatureCard.Alias].forEach((alias, index) => card.AliasExtended.push(alias + this.suffixSig))
                        }
                    }
                    this.addCard(card)
                    set.Summary[ArtifactManager.cardType(card)]++
                    set.TotalCards++
                })
                this.addSet(set)
            })
        })
    }
    addCard(card){
        this.cards.push(card)
    }
    addSet(set){
        this.sets.push(set)
    }
    getCard(name){
		return this.cards.find(card => [card.Name.toLowerCase(), ...card.Alias.map(alias => alias.toLowerCase()), ...card.AliasExtended.map(alias => alias.toLowerCase())].includes(name.toLowerCase()))
    }
    getSet(name){
        return this.sets.find(set => set.Name.toLowerCase() === name.toLowerCase())
    }
	searchCard(text) {
		text = text.toLowerCase()
		return this.cards.filter(c => {
			if ([c.Name, c.Text, c.SignatureCardName, c.IsSignatureCardName].map(s => s.toLowerCase()).find(s => s.includes(text))) { return true }
			if (c.Abilities.length && c.Abilities.find(s => s.Text.includes(text))) { return true }
		}).sort((a, b) => a.name > b.name ? 1 : -1)
    }
    parseMessage(msg, replacer) {
        if (msg.author.bot) { return }
        const query = msg.content.match(/\[([^\]]+)\]/g)
        if (!query || !query.length) { return }
        let limit = 0
        const cards = []
        query.reduce((cards,q) => {
            const search = q.match(/\[([^\]]+)]/)
            const card = this.getCard(search[1])
            if (!card || cards.length > 2) { return cards}
            cards.push(card)
            return cards
        }, []).forEach(card => this.renderCard(msg, card, replacer))
    }
    renderCard(msg, card, replacer){
        return msg.reply({
            embed: {
                // title : card.name,
                author: {
                    name: `${card.Name}${["Hero","Creep"].includes(card.CardType) ? ' - ' + card.Attack + '/' + card.Armor + '/' + card.Health : ''}`,
                    icon_url: card.CardTypeURL,
                    url: card.ImageURL
                },
                description: `${card.Abilities.length ? card.Abilities.map(s => `${s.Name ? '**' + s.Name + '** ' : ''}(${s.Type}${s.Type === "Active" ? ' CD: ' + s.Cooldown : ''}) - *${s.Text}*`).join('\n') + '\n' : ''}${card.Text ? '*' + card.Text + '*\n' : ''}${card.SignatureCardName && card.CardType === "Hero" ? '__**Signature Card:**__ ' + card.SignatureCardName + '\n' : ''}${card.IsSignatureCardName && card.CardType !== 1 ? '__**Signature Card for:**__ ' + card.IsSignatureCardName + '\n' : ''}${ArtifactManager.iconsCardString(card, replacer)}${[...card.Alias, ...card.AliasExtended].length ? '\n**Alias:** ' + [...card.Alias, ...card.AliasExtended].map(a => a).join(', ') + '\n' : ''}`, //.filter(a => !a.includes(_sig))
                thumbnail: { url: card.ImageURL, height: 40, width: 40 },
                footer: {icon_url: card.RarityURL, text: `Set: ${card.Set} - ${card.Rarity}` },
                color: ArtifactManager.cardColor(card)
            }
        })
    }
    static cardTypeURL(card){
        const result = ArtifactManager.cardType(card)
        return `https://github.com/ottah/ArtifactDB/blob/master/assets/icon/${result.toLowerCase()}.png?raw=true`
    }
    static rarityURL({Rarity}){
        return `https://github.com/ottah/ArtifactDB/blob/master/assets/icon/base_rarity/${Rarity.toLowerCase()}.png?raw=true`
    }
    static cardType(card){
        return card.CardType !== 'Item' ? card.CardType : card.ItemType
    }
    static cardColor({Color}){
        const colors = {
            Black: 1, // 0x000000,
            Blue: 28888, //0x0000ff,
            Green: 3234844, //0x00ff00,
            Red: 11534336, // 0xff0000
            Yellow: 10980914 //
        }
        return colors[Color] || 0xFFFFFF
    }
    static iconsCardString(card, replacer) {
        const keys = ['manacost', 'goldcost']
        return `${card.ManaCost ? `${replacer.replacer('<mana>')} ${card.ManaCost} ` : ''} ${card.GoldCost ? `${replacer.replacer('<gold>')} ${card.GoldCost} ` : ''} ${card.GetInitiative ? '⚡' : ''} ${card.CrossLane ? '<>' : ''}`
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
			fileName : '',
			RelatedIds : [],
			Alias: [],
			AliasExtended : [],
			SignatureCardName : '',
			IsSignatureCardName : ''
		}
	}
}

module.exports = ArtifactManager

//TODO parseMessage
//Info sets