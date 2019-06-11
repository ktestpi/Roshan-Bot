const { Command } = require('aghanim')
const enumAbilities = require('../../enums/abilities')
const EmbedBuilder = require('../../classes/embed-builder.js')

module.exports = new Command('ability', {
    category: 'Dota 2', help: 'Muestra información de un objeto de Dota 2', args: ''},
    async function (msg, args, client, command) {
        const ability = enumAbilities.getValueByName(args.from(1))
        if (!ability) { return }
        const embed = new EmbedBuilder({
            author: { name: '<_ability_name>', url: '<_ability_wikiurl>' },
            description: '<_ability_description>',
            fields: [],
            thumbnail: { url: '<_ability_url>' }
        })
        return msg.reply(embed
            .fn(Array.isArray(ability.cd),(schema) => schema.fields.push({name: 'CD', value: '<_ability_cd>', inline: false}))
            .build(client,msg.author.account.lang, {
                _ability_name: ability.dname,
                _ability_wikiurl: enumAbilities.dotaWikiURL + ability.dname.replace(/ /g, "_"),
                _ability_url: enumAbilities.apiURL + ability.img,
                _ability_description: ability.desc,
                _ability_cd: ability.cd.join(', ')
        }))
    })
