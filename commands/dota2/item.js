const { Command } = require('aghanim')
const enumItems = require('../../enums/items')

module.exports = new Command('item', {
    category: 'Dota 2', help: 'Muestra información de un objeto de Dota 2', args: ''
},
    function (msg, args, command) {
        const item = enumItems.getValueByName(args.from(1))
        // console.log(item)
        if (!item) { return }
        const embed = {
            author: { name: item.dname, url: `${enumItems.dotaWikiURL}${item.dname.replace(/ /g, "_")}` },
            description: item.notes,
            thumbnail: { url: `${enumItems.dotaCdnURL}${item.img}` },
            fields: [],
            footer : {text : item.lore},
            color: this.config.color
        }
        if(item.attrib && item.attrib.length){
            embed.fields.push({ name: 'Stats', value: `${item.attrib.map(attr => `*${attr.header}${attr.value} ${attr.footer}*`).join('\n')}`, inline: true })
        }
        if (item.components && item.components.length) {
            embed.fields.push({ name: `Components - Total cost: ${item.cost}`, value: `${item.components.map(component => `**${component.dname}** ${component.cost}`).join('\n')}`, inline: true })
        }
        if (item.active && item.active.length) {
            embed.fields.push({ name: 'Actives', value: `${item.active.map(active => `**${active.name}**: ${active.desc}`).join('\n')}`, inline: true })
        }
        if(item.cd){
            embed.fields.push({ name: 'Cd', value: item.cd, inline: true })
        }
        return msg.reply({embed})
    })
