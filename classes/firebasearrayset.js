module.exports = class FirebaseArraySet extends Set{
  constructor(stringarray,pvalues){
    if(stringarray.length){
      super(stringarray.split(','))
    }else{
      super()
    }
    this.possibleVals = pvalues && pvalues.length ? new Set(pvalues) : new Set()
  }
  addVal(value){
    if(this.possibleVals.has(value)){super.add(value)}
  }
  deleteVal(value){
    if(this.possibleVals.has(value)){super.delete(value)}
  }
  get array(){
    return Array.from(this)
  }
  get tostring(){
    return Array.from(this).sort().join(',')
  }
}
