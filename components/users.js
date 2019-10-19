const { Component } = require('aghanim')
const CustomComponent = require('../classes/custom-component')
const util = require('erisjs-utils')
const { Message, Guild } = require('erisjs-utils')

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