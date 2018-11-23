const Collection = require('./collection')

module.exports = class FirebaseCollection extends Collection{
    constructor(obj,db){
        if(db){
            super(obj)
            this.db = db
        }else{
            super({})
            this.db = obj
            this.db.once('value').then(snap => {
                if(snap.exists()){
                    snap = snap.val()
                    Object.keys(snap).forEach(keyItem => this.add(keyItem,snap[keyItem]))
                }
            })
        }
    }
    static mergeObject(base,merge){
        base = base !== undefined ? base : {}
        for (let el in merge) {
            if (typeof merge[el] === 'object') { base[el] = FirebaseCollection.mergeObject(base[el], merge[el]) }
            else { base[el] = merge[el] }
        }
        return Object.assign({}, base)
    }
    on(listen = 'value',func){
        this.db.on(listen,func.bind(this))
        return this
    }
    save(id,data){
        const add = this.has(id) ? FirebaseCollection.mergeObject(this.data(id), data) : data
        return this.db.child(id).update(add).then(() => this.add(id, add))
    }
    remove(id){
        return this.db.child(id).remove().then(() => this.delete(id))
    }
}