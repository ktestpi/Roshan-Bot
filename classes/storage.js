class FireStorageCache{
    constructor(db){
        this.db = db
        this.db.once('value').then(snap => {
            if(!snap.exists()){ return }
            snap = snap.val()
            this.bucket = snap.val()
        })
    }
    get(key = ''){
        const path = key.split('/')
        return path.reduce((sum, current) => {
            if(current === ''){return sum}
            return sum[current]
        },this.bucket)
    }
    update(key, data){
        let bucket = Object.assign(this.get(key), data)
        return this.db.child(key).update(bucket).then(() => {this.bucket = bucket})
    }
    remove(key){
        return this.db.child(key).remove().then(() => {delete this.get(key)})
    }
}