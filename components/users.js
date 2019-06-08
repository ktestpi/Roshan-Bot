const { Component } = require('aghanim')
const CustomComponent = require('../classes/custom-component')
const util = require('erisjs-utils')
const { Message, Guild } = require('erisjs-utils')
const { UserError, ConsoleError } = require('../classes/errors.js')

module.exports = class Users extends CustomComponent() {
    constructor(client, options) {
        super(client)
    }
    isSupporterCheckMessageCreate(msg, args, client){
        const result = this.isSupporter(msg.author.id)
        if(!result){msg.reply('bot.onlysupporterfunction')}
        return result
    }
    isBetatesterCheckMessageCreate(msg, args, client){
        const result = this.isBetatester(msg.author.id)
        if(!result){msg.reply('bot.onlybetatesterfunction')}
        return result
    }
    isBetatester(id){
        return this.betatesters().includes(id)
    }
    isSupporter(id){
        return this.supporters().includes(id)
    }
    betatesters(){
        const set = new Set([this.client.owner.id,...Array.from(this.client.cache.betatesters),...this.client.server.membersWithRole(this.client.config.roles.betatester).map(m => m.id)])
        return Array.from(set)
    }
    supporters(){
        const set = new Set([this.client.owner.id,...Array.from(this.client.cache.supporters),...this.client.server.membersWithRole(this.client.config.roles.supporter).map(m => m.id)])
        return Array.from(set)
    }
    getProfile(discordID){
        const user = this.client.users.get(discordID)
        return user ? user.profile : {}
    }
}



// module.exports.sendImageStructure = function (msg, query, links, cmd) {
//     if (!links[query]) { return module.exports.wrongCmd(msg, links, cmd) } // TODO wrongCmd
//     const match = links[query]
//     if (typeof match === 'object') {
//         util.Message.sendImage(match.file).then(buffer => {
//             msg.reply(match.msg, { file: buffer, name: match.name })
//         })
//     } else if (typeof query === 'string') {
//         msg.reply(match)
//     }
//     // if(typeof pics[query] == 'object'){
//     //   util.msg.sendImage_(url).then(buffer => {
//     //     msg.reply(util.string.replace(pics[query].msg, {author : msg.author.username},true),{file : buffer, name : pics[query].name});
//     //   })
//     //   util.msg.sendImage([pics[query].file],[],{msg : msg, config : config, pics : pics, query : query},function(results,container){
//     //
//     //   })
//     // }else{
//     //   msg.reply(util.string.replace(pics[query], {author : msg.author.username},true));
//     // }
// }