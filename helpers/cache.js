const util = require('erisjs-utils')

class FirebaseCache extends util.type.Collection{
  constructor(db,data,path){
    super(data)
    this.db = db
    this.path = path ? '/' + path : ''
    // console.log('Caché created with',data);
  }
  modify(id,data){
    return new Promise((resolve, reject) => {
      this.mutate(id,(element) => {
        // console.log(this);
        const newElement = Object.assign({},mergeObject(element,data))
        this.db.child(id+this.path).update(newElement).then(() => resolve(newElement))
        return newElement
      })
    })
  }
  data(id){
    let match = Object.assign({},this.get(id))
    delete match._id
    return match
  }
  save(id,data){
    return new Promise((resolve, reject) => {
      this.add(id,data)
      this.db.child(id+this.path).update(data).then(() => resolve()).catch(err => reject(err))
      })
  }
  erase(id){
    return new Promise((resolve, reject) => {
      this.delete(id)
      this.db.child(id).remove().then(() => resolve()).catch(err => reject(err))
      })
  }
  erasePath(){
    return new Promise((resolve, reject) => {
      this.delete(id)
      this.db.child(id+this.path).remove().then(() => resolve()).catch(err => reject(err))
      })
  }
  reset(func){
    // this.db.once('value').val()
  }
}

function mergeObject(base,merge){
    for (var el in merge) {
      if(typeof merge[el] === 'object'){mergeObject(base[el],merge[el])}
      else{base[el] = merge[el]}
    }
    delete base['_id']
    return Object.assign({},base)
}

module.exports = FirebaseCache
