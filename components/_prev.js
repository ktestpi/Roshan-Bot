const { Component } = require('aghanim')

module.exports = class Prev extends Component {
    constructor(client, options) {
        super(client)
    }
    ready() {
        this.client.server = this.client.guilds.get(this.client.config.guild.id)
    }
}