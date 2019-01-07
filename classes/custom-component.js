const { Component } = require('aghanim')

module.exports = function CustomPlug(...load){
    return class CustomComponent extends Component {
        constructor(client, options) {
            super(client)
            this.components = {}
        }
        require(...args) {
            args.filter(arg => this.client.components[arg]).forEach(arg => {
                this.components[arg] = this.client.components[arg]
            })
        }
        ready() {
            this.require(...load)
        }
        waitOn(event, func){
            this.client.on(event, (...args) => {
                func(...args)
            })
        }
        waitOnce(event, func){
            this.client.once(event, (...args) => {
                func(...args)
            })
        }
    }
}
