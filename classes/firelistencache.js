const { Datatype } = require('erisjs-utils')

class FireListenCache{
  constructor(dbListener){
    this.bucket = ''
    dbListener.on('value', snap => {
      this.bucket = new Datatype.Collection(snap.val())
    })
  }
}

module.exports = FireListenCache
