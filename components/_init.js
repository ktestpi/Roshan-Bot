const { Component } = require('aghanim')
const { Color } = require('erisjs-utils')

module.exports = class Init extends Component {
    constructor(client, options) {
        super(client)
        let CONFIG = require('../config.json')
        CONFIG.color = Color.convert(CONFIG.color, 'hex-int');
        for (let cat in CONFIG.colors) {
            if (typeof CONFIG.colors[cat] == 'string') { CONFIG.colors[cat] = Color.convert(CONFIG.colors[cat], 'hex-int'); continue }
            for (let c in CONFIG.colors[cat]) {
                CONFIG.colors[cat][c] = Color.convert(CONFIG.colors[cat][c], 'hex-int');
            }
        }
        this.client.config = CONFIG
        this.client.config.colors.palette = { default: CONFIG.color }
    }
    ready() {
        this.client.server = this.client.guilds.get(this.client.config.guild.id)
    }
}