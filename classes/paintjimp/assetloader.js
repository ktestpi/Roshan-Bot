const jimp = require('jimp')

class AssetLoader{
  constructor(basePath,routes){
    this._basePath = basePath || './'
    this._routes = {}
    Object.keys(routes).forEach(routeName => {
      this._routes[routeName] = routes[routeName]
      this._routes[routeName].path = this._routes[routeName].path + (!this._routes[routeName].path.endsWith('/') ? '/' : '')
      const route = this._routes[routeName]
      this[routeName] = (file) => {
        if(!file && route.default){
          file = route.default
        }else{
          if(route.conversor){file = route.conversor(file)}
        }
        if(!file){return null}
        // return this.read(this._basePath+route.path+file+'.'+route.ext)
        return AssetLoader.loadFile(this._basePath+route.path+file+'.'+route.ext)
      }
    })
  }
  read(file){
    return jimp.read(file)
  }
  font(file){
    return jimp.loadFont(file)
  }
  static loadFile(file){
    return jimp.read(file)
  }
  static loadFont(file){
    return jimp.loadFont(file)
  }
}

module.exports = AssetLoader
