const max = 1024
module.exports = {
	name: 'gameinfo',
	category: 'General',
	help: 'Información sobre el juego',
	args: '<dota/artifact>',
	run: async function (msg, args, client, command){
		if(args[1] === 'artifact'){
			return client.components.Artifact.gameInfo()
				.then(info => msg.reply('game.currentplayers', { count: info.currentplayers, game :'Artifact'}))
		}else{
			return client.components.Dota.gameInfo()
				.then(info => msg.reply('game.currentplayers', { count: info.currentplayers, game: 'Dota 2' }))
		}
	}
}
