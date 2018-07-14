// const util = require('erisjs-utils')

class FireSetCache extends Set{
  constructor(db,data){
    super(data)
    this.db = db
    // console.log('Caché created with',data);
  }
  save(id,value){
    return new Promise((resolve,reject) => {
      this.db.update({[id] : value ? true : null}).then(() => {
        value ? this.add(id) : this.delete(id)
        resolve()
      }).catch(err => reject(err))
    })
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
