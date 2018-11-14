const Timeout = require('../../../classes/timeout.js')

module.exports = class StatusFirebase{
  constructor(game,status){
    this.game = game
    this.status = status //dmg_received
    this.sugarrush = {start : 0, end : 0}
    this.chainSugarRush = true
    this.timeouts = {
      sugarrush : false,
      exhausted : false,
      active : false
    }
    //Hacer randomSugarRush no solo de hora en hora si no tambien cualquier segundo entre los límites
  }
  addDB(db){
    this.db = db
  }
  save(update){
    return new Promise(res => {this.status = Object.assign(this.status,update);res(this.status)})
    // return this.db.update(update).then(() => {this.status = Object.assign(this.status,update);return new Promise((res,rej) => {res(this.status)})})
  }
  getStatus(){
    return this.status
  }
  changeStatus(){
    const max = Object.keys(enumStatus).length
    let newStatus = this.status.mode
    while(newStatus === this.status.mode){
      newStatus = Math.floor(Math.random()*max)
    }
    return this.statusTo(newStatus)
  }
  statusTo(mode,doing = 0){
    mode = parseInt(mode)
    return this.save({mode}).then((status) => Promise.all([
      this.game.client.plugins.Bot.setStatus(doing,statusBot[status.mode],this.statusMsg(status.mode)),
      this.game.log(this.embed({description : `Roshan status changed to ${enumStatus[status.mode]}`}))
    ]))
  }
  statusToActive(){return this.statusTo(0)}
  // statusToExhausted(){return this.statusTo(1)}
  statusToSugarRush(){return this.statusTo(1).then(() => {
    this.sugarrush.start = now()
    const sugarRushDuration = this.game.config.events.sugarrush.duration
    this.sugarrush.end = this.sugarrush.start + minutesToS(sugarRushDuration)
    const delay = minutesToMS(this.game.config.events.sugarrush.duration)
    this.timeouts.active = new Timeout(() => {
      this.statusToActive()
      if(this.chainSugarRush){this.randomSugarRush(this.game.config.events.sugarrush.randomStart)}
    },delay)
    // this.timeouts.exhausted = new Timeout(() => {
    //   this.statusToExhausted()
    // },minutesToMS(sugarRushDuration))
  })}
  statusMsg(mode){
    return `Diretide - ${enumStatus[mode]} ${includeStatusMsg[mode]}`
  }
  randomSugarRush(intervalTime){
    const time = this.game.actions.intervalRandomNumber(intervalTime.map(v => v*3600))*1000 // TODO change 2 by 3600 to conver seconds interval in hours
    this.timeouts.sugarrush = new Timeout(() => this.statusToSugarRush(),time)
  }
  nextSugarRush(){
    return this.game.actions.secondsToHms(this.timeouts.sugarrush.endTime())
  }
  stopSugarRush(){
    this.chainSugarRush = false
  }
  clearTimers(){
    try{
      this.timeouts.active.clear()
    }catch(err){
      console.log(err);
    }
    try{
      this.timeouts.sugarrush.clear()
    }catch(err){
      console.log(err);
    }
  }
  stopcycle(){
    this.clearTimers()
    return this.statusTo(0).then(() => this.game.log(this.embed({description : ':x: Event cycle stopped'})))
  }
  startcycle(){
    this.clearTimers()
    this.statusTo(0).then(() => this.randomSugarRush(this.game.config.events.sugarrush.randomStart))
  }
  getModeName(){
    return enumStatus[this.status.mode]
  }
  embed(embed){
    embed.color = this.game.config.roshan.color
    return { embed }
  }
}

const enumStatus = {
  "0" : "Active",
  "1" : "SugarRush"
}

const statusBot = {
  "0" : "online", // idle
  "1" : "dnd"
}

const includeStatusMsg = {
  "0" : "| Can't attack",
  "1" : "| r!sugar"
}

function minutesToS(time){return time*60}
function minutesToMS(time){return time*60*1000}
function hoursToMS(time){return time*3600*1000}
function now(){return Math.round(Date.now()/1000)}
