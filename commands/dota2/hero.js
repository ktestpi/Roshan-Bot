const { Command } = require('aghanim')
const enumHeroes = require('../../enums/heroes')

module.exports = new Command('hero', {
    category: 'Dota 2', help: 'Muestra información de dota', args: ''
},
    function (msg, args, command) {
        const hero = enumHeroes.getValueByAlias(args[1])
        // console.log(hero)
        if(!hero){return }
        return msg.reply({embed : {
            author: { name: hero.localized_name, icon_url: `${enumHeroes.dotaCdnURL}${hero.icon}`, url: `${enumHeroes.dotaWikiURL}${hero.localized_name.replace(/ /g, "_")}`},
            // title: hero.localized_name,
            thumbnail: { url: `${enumHeroes.dotaCdnURL}${hero.img}`},
            fields : [
                { name: 'Stats', value: `Base health: ${hero.base_health + Math.round((hero.primary_attr === "str" ? 22.5 : 17) * hero.base_str)}\nBase mana: ${hero.base_mana + ((hero.primary_attr === "int" ? 15 : 12) * hero.base_int)}\nBase armor: ${hero.base_armor + Math.round((hero.primary_attr === "agi" ? 0.2 : 0.16) * hero.base_agi)}\nAttack type: ${hero.attack_type}\nRange: ${hero.attack_range}\nMS: ${hero.move_speed}`, inline : true},
                { name: 'Attributes', value: `${hero.primary_attr === 'str' ? '__' : ''}Str${hero.primary_attr === 'str' ? '__' : ''}: ${hero.base_str} + ${hero.str_gain}\n${hero.primary_attr === 'agi' ? '__' : ''}Agi${hero.primary_attr === 'agi' ? '__' : ''}: ${hero.base_agi} + ${hero.agi_gain}\n${hero.primary_attr === 'int' ? '__' : ''}Int${hero.primary_attr === 'int' ? '__' : ''}: ${hero.base_int} + ${hero.int_gain}`, inline : true},
                { name : 'Roles', value : `${hero.roles.join(', ')}`, inline : true},
                { name : 'Abilities', value : `${hero.abilities.join(', ')}`, inline : false}
            ],           
            color : this.config.color
        }})
    })
