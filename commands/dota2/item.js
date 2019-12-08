const enumItems = require('../../enums/items')

module.exports = {
    name: 'item', 
    category: 'Dota 2',
    help: 'Muestra información de un objeto de Dota 2',
    args: '',
    run: async function (msg, args, client, command) {
        const item = enumItems.getValueByName(args.from(1))
        // FIXME: when search sange we get sange and yasha. See enumItems.getValueByName method
        if (!item) { return }
        const embed = {
            embed: {
                author: {name: '<_item_name>', url: '<_item_wikiurl>'},
                description: '<_item_description>',
                thumbnail: { url: '<_item_image>'},
                fields : [],
                footer : {text : '<_item_lore>'}
            }
        }
        if (item.attrib && item.attrib.length) {
            embed.embed.fields.push({name : 'Stats', value: '<_item_attrib>', inlue : true})
        }
        if (item.components && item.components.length) {
            embed.embed.fields.push({ name: 'Components - Total cost: <_item_cost>', value: '<_item_components>', inlue: true })
        }
        if (item.active && item.active.length) {
            embed.embed.fields.push({ name: 'Actives', value: '<_item_actives>', inlue: true })
        }
        if (item.cd) {
            embed.embed.fields.push({ name: 'Cd', value: '<_item_cd>', inlue: true })
        }
        return msg.reply(embed,
            {
                _item_name: item.dname,
                _item_wikiurl: enumItems.dotaWikiURL + item.dname.replace(/ /g, "_"),
                _item_description: item.notes,
                _item_lore: item.lore,
                _item_attrib: item.attrib && item.attrib.length ? item.attrib.map(attr => `*${attr.header}* ${attr.value} ${attr.footer || ''}`).join('\n') : '',
                _item_components: item.components && item.components.length ? item.components.map(component => `**${component.dname}** ${component.cost}`).join(', ') : '',
                _item_cost: item.cost,
                _item_actives: item.active && item.active.length ? item.active.map(active => `**${active.name}**: ${active.desc}`).join('\n') : '',
                _item_cd: item.cd || 0,
                _item_image: `${enumItems.dotaCdnURL}${item.img}`
        })
    }
}
