module.exports = {
    name: ['searchdeck','sdeck'],
    category: 'Artifact',
    help: 'Busca nombres de mazos por término de búsqueda',
    args: '[búsqueda]',
    run: async function (msg, args, client, command) {
        if (!args[1]) { return msg.reply('searchdeck.error.needarg') }
        const search = args.from(1)
        const decks = client.components.Artifact.findAllCachedDeckByName(search)
        if (!decks.length) { return msg.reply('searchdeck.error.nodecksfound', {search}) }
        return msg.reply({
            embed : {
                title: '<searchdeck.search>',
                description: '<_decks>',
                footer: {text: 'Results: <_decks_count>'}
            }
        },{
            _decks: decks.map(deck => deck.name).join(', '),
            _decks_count: decks.length
        })
    }
}