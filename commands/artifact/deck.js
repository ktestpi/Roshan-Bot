const { Command } = require('aghanim')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')
const { Markdown } = require('erisjs-utils')

module.exports = new Command('deck', {
    category: 'Artifact', help: 'Genera un mazo desde un código', args: '[código/nombre mazo]', cooldown: 30,
    cooldownMessage: function (msg, args, command, cooldown) { return this.locale.getUserString('warningInCooldown', msg) }},
    function (msg, args, command) {
        if (!args[1]) { throw new UserError('artifact', 'cmd_deck_error_need_arg_or_valid_code'); return}
        const deckCached = this.cache.decks.find(deck => deck.name.toLowerCase() === String(args.from(1)).toLowerCase())
        const code = deckCached ? deckCached._id : this.components.Artifact.isValidDeckCode(args[1])
        if (!code) { throw new UserError('artifact', 'cmd_deck_error_need_arg_or_valid_code'); return}
        // 'ADCJWkTZX05uwGDCRV4XQGy3QGLmqUBg4GQJgGLGgO7AaABR3JlZW4vQmxhY2sgRXhhbXBsZQ__'
        const deck = this.components.Artifact.getCachedDeck(code)
        // console.log('CODE',code)
        if(deck){
            return embedResponse(msg, this, deck)
        }else{
            msg.channel.sendTyping()
            return this.components.Artifact.generateDeck(code, args[2] ? args.from(2) : null)
                .then(result => {
                    // return this.components.Artifact.uploadDeckAndCache(result.buffer, code, result.data.name, msg.author.id)
                    //     .then((deck) => embedResponse(msg,this,deck))
                    return this.createMessage(this.config.guild.generated, '', { file: result.buffer, name: result.data.code + '.jpg' })
                        .then(m => this.components.Artifact.saveDeckIntoCache(result.data.code, result.data.name, msg.author.id, m.attachments[0].url))
                        .then(deck => embedResponse(msg, this, deck))
                })
        }
    })


    function embedResponse(msg,bot,data){
        const author = bot.users.get(data.author) || {}
        return msg.reply({
            embed: {
                title: `${data.name} - Click to see at playartifact.com`,
                description: `${Markdown.link(data.url,'click to download image')}\nCode: \`${data._id}\``,
                url: bot.components.Artifact.deckCodeUrl(data._id),
                image: { url: data.url },
                footer: { text: `Uploaded: ${(author.username || 'Unknown')}`, icon_url: author.avatarURL || '' },
                color: bot.config.color
            }
        })
    }