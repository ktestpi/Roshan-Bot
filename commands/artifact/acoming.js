const { Command } = require('aghanim')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')
const { Markdown } = require('erisjs-utils')

module.exports = new Command('countdown', {
    category: 'Artifact', help: 'Genera un mazo desde un código', args: '[código/nombre mazo]' 
},
    function (msg, args, command) {
        const coming = Math.round((new Date('Wed, 28 Nov 2018 22:00:00')).getTime() - (new Date()).getTime())/1000
        if(coming > 0){
            return msg.reply(this.locale.replacer(`<artifact> Artifact sale en <cooldown> ${secondsToHms(coming)}`))
        }else{
            return msg.reply('Artifact ya salió! Corre a jugar!')
        }
        
    })

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hora, " : " horas, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minuto, " : " minutos, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " segundo" : " segundos") : "";
    return hDisplay + mDisplay + sDisplay;
}