module.exports = class Timeout{
  constructor(func,delay){
    this._timer = setTimeout(() => {
      func()
      this.running = false
    },delay)
    this._func = func
    this.start = Date.now()
    this.running = true
  }
  remaining(){
    return Math.round((this.endTime() - Date.now())/1000)
  }
  startTime(){
    return this.start
  }
  endTime(){
    return this.start + this._timer._idleTimeout
  }
  delayTime(){
    return this._timer._idleTimeout
  }
  clear(){
    clearTimeout(this._timer)
  }
  stop(){
    clearTimeout(this._timer)
  }
}
