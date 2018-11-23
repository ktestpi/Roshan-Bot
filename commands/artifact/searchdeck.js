const { Command } = require('aghanim')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')

module.exports = new Command(['searchdeck','sdeck'], {
    category: 'Artifact', help: 'Busca nombres de mazos por término de búsqueda', args: '[búsqueda]'},
    function (msg, args, command) {
        if (!args[1]) { throw new UserError('artifact', 'cmd_searchdeck_error_need_arg'); return }
        const search = args.from(1)
        const decks = this.plugins.Artifact.findAllCachedDeckByName(search)
        if (!decks.length) { throw new UserError('artifact', 'cmd_searchdeck_error_no_decks_found', {search}); return }
        return msg.reply({embed : {
            title : 'Searching Decks',
            description : decks.map(deck => deck.name).join(', '),
            footer : {text : `Results: ${decks.length}`},
            color : this.config.color
        }})
    })