const { Plugin } = require('aghanim')
const util = require('erisjs-utils')
const { Message, Guild } = require('erisjs-utils')
const Timeout = require('../classes/timeout')

module.exports = class Funcs extends Plugin {
    constructor(client, options) {
        super(client)
        this.endDate = (new Date('Wed, 28 Nov 2018 22:00:00')).getTime()
        console.log('Dates',this.endDate,new Date().getTime())
        // this.endDate = new Date('2018-11-28T23:00:00.000Z').getTime()
        this.remaining = () => {
            return Math.round((this.endDate - (new Date()).getTime())/1000)
        }
        this.channel = '474935110567985152'
        this.repeatEach = 3600
        this.starterTimer = this.remaining() % this.repeatEach
        console.log(this.starterTimer)
    }
    ready(){
        this.setTimeout(this.starterTimer)
    }
    setTimeout(time = 3600){
        this.timer = new Timeout(() => this.func(this.repeatEach), time * 1000)
        // this.timer = setTimeout(() => this.func(),time*1000)
    }
    func(time = 3600){
        const coming = this.remaining()
        if(coming > 0){
            this.client.createMessage(this.channel, this.client.locale.replacer(`<artifact> Artifact sale en <cooldown> ${secondsToHms(coming)}`))
            this.timer.clear()
            if(coming > this.repeatEach){
                this.setTimeout(this.repeatEach)
            }else{
                this.timer = new Timeout(() => this.client.createMessage(this.channel, this.client.locale.replacer(`<artifact> Artifact está en cualquier momento!`)), coming * 1000)
            }
        }else{
            this.timer.clear()
        }
    }
}

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