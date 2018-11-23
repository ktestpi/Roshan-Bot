const { Command } = require('aghanim')
const enumAbilities = require('../../enums/abilities')

module.exports = new Command('ability', {
    category: 'Dota 2', help: 'Muestra información de un objeto de Dota 2', args: ''
},
    function (msg, args, command) {
        const ability = enumAbilities.getValueByName(args.from(1))
        if (!ability) { return }
        const embed = {
            author: { name: ability.dname, url: `${enumAbilities.dotaWikiURL}${item.dname.replace(/ /g, "_")}`},
            // title: ability.dname,
            description : ability.desc,
            thumbnail: { url: `${enumAbilities.apiURL}${ability.img}` },
            fields: [],
            // footer: { text: ability.lore },
            color: this.config.color
        }
        if (ability.attrib && ability.attrib.length) {
            embed.fields.push({ name: 'Stats', value: `${ability.attrib.map(attr => `${attr.header} ${typeof attr.value === 'string' ? attr.value : attr.value.join(', ')}`).join('\n')}`, inline: true })
        }
        // if (ability.active && ability.active.length) {
        //     embed.fields.push({ name: 'Actives', value: `${ability.active.map(active => `**${active.name}**: ${active.desc}`).join('\n')}`, inline: true })
        // }
        embed.fields.push({name: 'General', value: `Behavior: ${ability.behavior}\nDmg type: ${ability.dmg_type}\nPierce: ${ability.bkbpierce}`, inline: true })
        if(Array.isArray(ability.cd)){
            embed.fields.push({ name: 'CD', value: ability.cd.join(', '), inline: true })
        }
        return msg.reply({ embed })
    })
