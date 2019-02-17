const { Command } = require('aghanim')
const enumItems = require('../../enums/items')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
    author: {name: '<_item_name>', url: '<_item_wikiurl>'},
    description: '<_item_description>',
    thumbnail: '<_item_image>',
    fields : [],
    footer : {text : '<item_lore>'}
})
module.exports = new Command('item', {
    category: 'Dota 2', help: 'Muestra información de un objeto de Dota 2', args: ''
},
    async function (msg, args, client) {
        const item = enumItems.getValueByName(args.from(1))
        // console.log(item)
        if (!item) { return }
        const embed = {
            author: { name: item.dname, url: `${enumItems.dotaWikiURL}${item.dname.replace(/ /g, "_")}` },
            description: item.notes,
            thumbnail: { url: `${enumItems.dotaCdnURL}${item.img}` },
            fields: [],
            footer : {text : item.lore},
            color: client.config.color
        }
        return msg.reply(embed
            .fn(item.attrib && item.attrib.length, (schema) => schema.fields.push({name : 'Stats', value: '<_item_attrib>', inlue : true}))
            .fn(item.components && item.components.length, (schema) => schema.fields.push({ name: 'Components - Total cost: <_tem_cost>', value: '<_item_compoents>', inlue: true }))
            .fn(item.active && item.active.length, (schema) => schema.fields.push({ name: 'Actives', value: '<_item_actives>', inlue: true }))
            .fn(item.cd, (schema) => schema.fields.push({ name: 'Cd', value: '<_item_cd>', inlue: true }))
            .build(client,args.user.langFlag,{
                _item_name: item.dname,
                _item_wikirul: enumItems.dotaWikiURL + item.dname.replace(/ /g, "_"),
                _item_description: item.notes,
                _item_lore: item.lore,
                _item_attrib: item.attrib && item.attrib.length ? item.attrib.map(attr => `*${attr.header}${attr.value} ${attr.footer}*`).join('\n') : '',
                _item_components: item.components && item.components.length ? item.components.map(component => `**${component.dname}** ${component.cost}`) : '',
                _item_cost: item.cost,
                _item_actives: item.active && item.active.length ? item.active.map(active => `**${active.name}**: ${active.desc}`).join('\n') : '',
                _item_cd: item.cd || 0
        }))
    })
