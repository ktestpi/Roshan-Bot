const { Plugin } = require('aghanim')


module.exports = function CustomPlug(...load){
    return class CustomPlugin extends Plugin {
        constructor(client, options) {
            super(client)
            this.plugins = {}
        }
        require(...args) {
            args.filter(arg => this.client.plugins[arg]).forEach(arg => {
                this.plugins[arg] = this.client.plugins[arg]
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
