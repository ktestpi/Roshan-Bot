const { Component } = require('aghanim')

module.exports = class Embed extends Component {
    constructor(client, options) {
        super(client)
    }
    new(schema){
        return new EmbedConstructor(schema, client)
    }
}
