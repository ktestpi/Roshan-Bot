const { Component } = require('aghanim')


module.exports = class Scripts extends Component {
    constructor(client, options) {
        super(client)
        this.scripts = {}
    }
    ready() {
        this.update()
    }
    update(){
        return new Promise((resolve, reject) => {
            this.client.scripts = {}
            this.client.getMessages('470189277544841226').then(messages => {
                messages
                    .filter(m => m.content.startsWith('🇫'))
                    .map(m => ({ tag: m.content.match(/\*\*(\w+)\*\*/)[1], src: m.content.match(/\`\`\`js[\n]?(.+)[\n]?\`\`\`/)[1] }))
                    .forEach(c => { try { this.client.scripts[c.tag] = eval(`${c.src}`) } catch (err) { return this.client.notifier.console('Error loading scripts\n' + err.stack) } })
                    this.client.notifier.console('Scripts','Loaded')
                    resolve()
            })
        })
    }
}
