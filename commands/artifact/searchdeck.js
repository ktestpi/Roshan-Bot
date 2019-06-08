const { Command } = require('aghanim')
const { UserError, ConsoleError } = require('../../classes/errors.js')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
    title: 'Searching Decks',
    description: '<_decks>',
    footer: {text: 'Results: <_decks_count>'}
})

module.exports = new Command(['searchdeck','sdeck'], {
    category: 'Artifact', help: 'Busca nombres de mazos por término de búsqueda', args: '[búsqueda]'},
    async function (msg, args, client) {
        if (!args[1]) { throw new UserError('artifact', 'searchdeck.error.needarg'); return }
        const search = args.from(1)
        const decks = client.components.Artifact.findAllCachedDeckByName(search)
        if (!decks.length) { throw new UserError('artifact', 'searchdeck.error.nodecksfound', {search}); return }
        return msg.reply(embed,{
            _decks: decks.map(deck => deck.name).join(', '),
            _decks_count: decks.length
        })
    })

// TODO langstring