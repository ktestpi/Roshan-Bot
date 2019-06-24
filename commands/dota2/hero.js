const { Command } = require('aghanim')
const enumHeroes = require('../../enums/heroes')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
    author: { name: '<_hero_name>', icon_url: '<_hero_icon>', url: '<_hero_wikiurl>'},
    thumbnail: {url: '<_hero_image>'},
    fields: [
        { name: 'Stats', value: 'Base health: <_hero_basehealth>\nBase mana: <_hero_basemana>\nBase armor: <_hero_basearmor>\nAttack type: <_hero_attacktype>\nRange: <_hero_range>\nMS: <_hero_ms>\n', inline: true},
        { name: 'Attributes', value: '<_str_ps>Str<_str_ps>: <_str> + <_str_gain>\n<_agi_ps>Agi<_agi_ps>: <_agi> + <_agi_gain>\n<_int_ps>Int<_int_ps>: <_int> + <_int_gain>', inline: true},
        { name: 'Roles', value: '<_roles>', inline: true},
        { name: 'Abilities', value: '<_abilities>', inline: true}
    ]
})

module.exports = new Command('hero', {
    category: 'Dota 2', help: 'Muestra información de dota', args: ''},
    async function (msg, args, client, command) {
        const hero = enumHeroes.getValueByAlias(args.from(1))
        if(!hero){ return }
        console.log(hero)
        return msg.reply(embed,{
            _hero_basehealth: hero.base_health + Math.round((hero.primary_attr === "str" ? 22.5 : 17) * hero.base_str),
            _base_mana: hero.base_mana + ((hero.primary_attr === "int" ? 15 : 12) * hero.base_int),
            _base_armor: hero.base_armor + Math.round((hero.primary_attr === "agi" ? 0.2 : 0.16) * hero.base_agi),
            _hero_attacktype: hero.attack_type,
            _hero_range: hero.attack_range,
            _hero_ms: hero.move_speed,
            _str_ps: hero.primary_attr === 'str' ? '__' : '',
            _agi_ps: hero.primary_attr === 'agi' ? '__' : '',
            _int_ps: hero.primary_attr === 'int' ? '__' : '',
            _str: hero.base_str,
            _str_gain: hero.str_gain,
            _agi: hero.base_agi,
            _agi_gain: hero.agi_gain,
            _int: hero.base_int,
            _int_gain: hero.int_gain,
            _roles: hero.roles.join(', '),
            _abilities: hero.abilities.join(', '),
            _hero_image: `${enumHeroes.dotaCdnURL}${hero.img}`,
            _hero_icon: `${enumHeroes.dotaCdnURL}${hero.icon}`,
            _hero_name: hero.localized_name,
            _hero_basemana: hero.base_mana + ((hero.primary_attr === "int" ? 15 : 12) * hero.base_int),
            _hero_basearmor: hero.base_armor + Math.round((hero.primary_attr === "agi" ? 0.2 : 0.16) * hero.base_agi)
        })
    })
