module.exports = class Collection extends Map{
    constructor(obj = {}){
        super(Object.keys(obj).map(k => {obj[k]._id = k; return [k,obj[k]]}))
    }
    get keysID(){
        return this.toArray().map(k => k._id)
    }
    toArray(){
        const array = []
        for (let item of this.values()) {
            array.push(item)
        }
        return array
    }
    add(id,data){
        data._id = id
        super.set(id,data)
        return this.get(id)
    }
    get(id) {
        return this.has(id) ? JSON.parse(JSON.stringify(super.get(id))) : undefined
    }
    getByProp(prop,value){
        return this.find(item => item[prop] === value)
    }
    data(id){
        let match = Object.assign({}, this.get(id))
        delete match._id
        return match
    }
    find(func){
        return this.toArray().find(func)
    }
    filter(func){
        return this.toArray().filter(func)
    }
    reduce(func){
        return this.toArray().reduce(func)
    }
    map(func){
        return this.toArray().map(func)
    }
    sort(func){
        return this.toArray().sort(func)
    }
    each(func){
        this.toArray().forEach(item => this.add(item._id,func(item)))
    }
    get keys(){
        const array = []
        for (let item of this.keys()) {
            array.push(item)
        }
        return array
    }
}