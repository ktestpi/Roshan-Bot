const CustomPlugin = require('../classes/plugin.js')

module.exports = class CP extends CustomPlugin('Account') {
    constructor(client, options) {
        super(client)
    }
    ready(){
        super.ready()
        console.log(this.plugins)
    }
}