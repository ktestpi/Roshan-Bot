const { Plugin } = require('aghanim')

module.exports = class Prev extends Plugin {
    constructor(client, options) {
        super(client)
    }
    ready() {
        this.client.server = this.client.guilds.get(this.client.config.guild.id)
    }
}