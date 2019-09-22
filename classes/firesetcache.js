// const util = require('erisjs-utils')

class FireSetCache extends Set{
  constructor(db,data = []){
    super(data)
    this.db = db
  }
  save(id,value){
    return new Promise((resolve,reject) => {
      this.db.update({[id] : value ? true : null}).then((data) => {
        value ? this.add(id) : this.delete(id)
        resolve()
      }).catch(err => reject(err))
    })
  }
  load(){
    this.db.once('value').then(snap => {
      if(!snap.exists()){return}
      Object.keys(span.val()).forEach(k => this.add(k))
    })
    return this
  }
  include(id){
    return this.save(id,true)
  }
  exclude(id){
    return this.save(id,false)
  }
  array(){
    let result = []
    for (let item of this.keys()) {
      result.push(item)
    }
    return result
  }
  map(func){
    return this.array().map(func)
  }
}


module.exports = FireSetCache
