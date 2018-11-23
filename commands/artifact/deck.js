const { Command } = require('aghanim')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')
const { Markdown } = require('erisjs-utils')

module.exports = new Command('deck', {
    category: 'Artifact', help: 'Genera un mazo desde un código', args: '[código/nombre mazo]', cooldown: 30,
    cooldownMessage: function (msg, args, command, cooldown) { return this.locale.getUserString('warningInCooldown', msg) }},
    function (msg, args, command) {
        if (!args[1]) { throw new UserError('artifact', 'cmd_deck_error_need_arg_or_valid_code'); return}
        const deckCached = this.cache.decks.find(deck => deck.name.toLowerCase() === String(args.from(1)).toLowerCase())
        const code = deckCached ? deckCached._id : this.plugins.Artifact.isValidDeckCode(args[1])
        if (!code) { throw new UserError('artifact', 'cmd_deck_error_need_arg_or_valid_code'); return}
        // 'ADCJWkTZX05uwGDCRV4XQGy3QGLmqUBg4GQJgGLGgO7AaABR3JlZW4vQmxhY2sgRXhhbXBsZQ__'
        const deck = this.plugins.Artifact.getCachedDeck(code)
        if(deck){
            return embedResponse(msg, this, deck)
        }else{
            msg.channel.sendTyping()
            return this.plugins.Artifact.generateDeck(code)
                .then(result => {
                    return this.plugins.Artifact.uploadDeckAndCache(result.buffer, code, result.data.name, msg.author.id)
                        .then((deck) => embedResponse(msg,this,deck))
                })
        }
                // const file = this.storage.file(`decks/${result.data.code}.jpg`)
                // file.createWriteStream({public : true})
                //     .on('error', (err) => { })
                //     .on('finish', (...val) => {
                //         file.get().then(([f,r]) => {
                //             console.log(f,r)
                //             this.cache.decks.save(result.data.code,{})
                //             msg.reply({embed : {
                //                 title: result.data.name,
                //                 url: result.data.deckUrl,
                //                 image : {url : r.mediaLink},
                //                 footer: { text: `Uploaded: ${deckCached ? (this.users.get(deckCached.author) || 'Unknown') : 'Unknown'}` },
                //                 color : this.config.color
                //             }}).then(m => res(m))
                //         })
                //     })
                //     .end(result.buffer)
            //     return this.createMessage(this.config.guild.generated, `**${msg.author.username}** generó`, { file: result.buffer, name: `${result.data.name}.jpg` }).then(m => {
            //         msg.reply({embed : {
            //             title: result.data.name,
            //             url: result.data.deckUrl,
            //             // description: `Code: \`${result.data.code}\``,
            //             image: { url: m.attachments[0].url },
            //             footer: { text: `Uploaded: ${deckCached ? (this.users.get(deckCached.author) || 'Unknown') : 'Unknown'}`},
            //             color : this.config.color
            //         }})

            //     })
            // }).catch(err => { throw new UserError('artifact', 'cmd_deck_error_generating_deck', err); return})
    })


    function embedResponse(msg,bot,data){
        const author = bot.users.get(data.author) || {}
        return msg.reply({
            embed: {
                title: data.name,
                description: `${Markdown.link(data.url,'download')}`,
                url: bot.plugins.Artifact.deckCodeUrl(data._id),
                image: { url: data.url },
                footer: { text: `Uploaded: ${(author.username || 'Unknown')}`, icon_url: author.avatarURL || '' },
                color: bot.config.color
            }
        })
    }