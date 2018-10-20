const { Datatype } = require('erisjs-utils')

class FireListenCache{
  constructor(dbListener){
    this.bucket = ''
    dbListener.on('value', snap => {
      // console.log('FireListenCache',snap.val());
      this.bucket = new Datatype.Collection(snap.val())
      // console.log(this.bucket);
    })
  }
}

module.exports = FireListenCache
