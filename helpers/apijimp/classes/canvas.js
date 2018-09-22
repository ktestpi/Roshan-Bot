const jimp = require('jimp')

class Square{
  constructor(x,y,w,h){
    this.x = x || 0
    this.y = y || 0
    this.w = w || 0
    this.h = h || 0
  }
  place(ref,mode,options){
    // if(!ref){throw new Error('Referencia no encontrada')}
    if(!ref){
      console.log('Warning: Referencia no encontrada! => Ref = Self');
      ref = {x : this.x, y : this.y, w : this.w, h : this.h}
    }
    options = options || {x : 0, y : 0}
    options.x = options.x || 0
    options.y = options.y || 0
    if(mode.includes('lx')){ // >>|[s] r|
        this.x = ref.x + options.x
    }else if(mode.includes('rx')){ // |r|[s]>>
        this.x = ref.x + ref.w + options.x
    }else if(mode.includes('cx')){ // |r[>s<]|>>
        this.x = ref.x + (ref.w-this.w)/2 + options.x
    }else if(mode.includes('csx')){ // x[>s<]
        this.x = this.x - this.w/2 + options.x
    }else if(mode.includes('gxl')){ //|r[s]|
      this.x = ref.x + options.x
    }else if(mode.includes('gxr')){ //| r [s]|<<
      this.x = ref.x + ref.w - this.w - options.x
    }
    if(mode.includes('ty')){ // __|[s^] r|
        this.y = ref.y + options.y
    }else if(mode.includes('by')){
        this.y = ref.y + ref.h + options.y
    }else if(mode.includes('cy')){
        this.y = ref.y + (ref.h-this.h)/2 + options.y
    }else if(mode.includes('csy')){
        this.y = this.y - this.h/2 + options.y
    }else if(mode.includes('gyt')){
      this.y = ref.y
    }else if(mode.includes('gyb')){
      this.y = ref.y + ref.h - this.h - options.y
    }
    return this
  }
  set(ref,mode,options){
    this.place(ref,mode,options)
    return this.add()
  }
  move(x,y,dx,dy){
    // console.log('Moving:',this.name,x,y,dx,dy);
    this.x = x !== null ? x : this.x + dx
    this.y = y !== null ? y : this.y + dy
    return this
  }
  difOrigin(el){
    return { dx : this.x - el.x, dy : this.y - el.y }
  }
}

class Element extends Square{
  constructor(name,data,canvas){
    super(data.x,data.y,data.w,data.h)
    this.type = 'Element'
    this.name = name
    this.canvas = canvas
    // console.log('CREATE ELEMENT,',this.name,!this.canvas);
    if(!this.canvas){console.log('Element NO BASE: ',this.name);}
  }
  log(){
    console.log('Element:',this.name,'TYPE:',this.type);
    console.log('X/Y:',this.x,this.y);
    console.log('W/H:',this.w,this.h);
    return this
  }
  add(){
    // console.log('ADDING:',this.name,!this.canvas);
    this.canvas.add(this)
    return this
  }
}

class Image extends Element{
  constructor(name,data,canvas){
    super(name,data,canvas)
    this.type = 'Image'
    this.img = data.img
    this.w = data.img.bitmap.width
    this.h = data.img.bitmap.height
  }
}

class Text extends Element{
  constructor(name,data,canvas){
    super(name,data,canvas)
    this.type = 'Text'
    this.font = data.font
    this.text = String(data.text)
    this.w = Text.width(this.font,this.text)
    this.h = data.font.info.size
    this.cut = (chars) => {}
  }
  sliceUntil(chars){
    this.text = this.text.slice(0,chars)
    return this
  }
  static width(font,text){
    const chars = text.split('');
    let size = 0
    chars.forEach(c => {
      size += font.chars[c] ? font.chars[c].xadvance : 0
    })
    return size
  }
}

class Canvas extends Square{
  constructor(base,fonts){
    super(0,0,base.bitmap.width,base.bitmap.height)
    this.base = base
    this.fonts = fonts || {}
    this.elements = []
  }
  new(type,name,data){
    return new Element(name,data,this)
  }
  write(name,text,font,options){
    let data = {}
    data.text = text
    data.font = typeof(font === 'string') && this.fonts[font] ? this.fonts[font] : font
    options = options || {}
    data.x = options.x ? options.x : undefined
    data.y = options.y ? options.y : undefined
    return new Text(name,data,this)
  }
  paint(name,img,options){
    let data = Object.assign({img},options ? options : {})
    return new Image(name,data,this)
  }
  ref(name,data){
    return new Element(name,data,this)
  }
  group(name,elements,data){
    return new Group(name,elements,this)
  }
  add(el){
    if(!((el instanceof Element) || (el instanceof Image) || (el instanceof Text))){ throw new Error('Elemento no compatible')}
    this.elements.push(el)
    return this
  }
  create(format){
    this.elements.forEach(el => {
      if(el instanceof Image){
        this.base.composite(el.img,el.x,el.y)
      }else if(el instanceof Text){
        this.base.print(el.font,el.x,el.y,el.text)
      }
    })
    return new Promise((resolve,reject) => {
      // this.base.getBuffer(jimp.MIME_JPEG,function(err,buffer){resolve(buffer)})
      this.base.getBuffer(format === 'png' ? jimp.MIME_PNG : jimp.MIME_JPG,function(err,buffer){
        if(err){reject(err)}
        resolve(buffer)
      })
    })
  }
  log(){
    console.log('Canvas:',this.name);
    console.log('X/Y:',this.x,this.y);
    console.log('W/H:',this.w,this.h);
    console.log('NumElements:',this.elements.length);
    return this
  }
}

function startFromNull(value,start){return value === null ? start : value}

class Group extends Square{
  constructor(name,elements,base){
    super()
    this.elements = elements
    this.base = base
    let min = {x : null, y : null}
    let max = {x : null, y : null}
    this.elements.forEach(el => {
      if(!((el instanceof Element) || (el instanceof Image) || (el instanceof Text))){ throw new Error('Elemento no compatible para un grupo')}
      min.x = startFromNull(min.x,el.x)
      min.y = startFromNull(min.y,el.y)
      max.x = startFromNull(max.x,el.x+el.w)
      max.y = startFromNull(max.y,el.y+el.y)
      if(el.x < min.x){min.x = el.x}
      if(el.x + el.w > max.x){max.x = el.x + el.w}
      if(el.y < min.y){min.y = el.y}
      if(el.y + el.h > max.y){max.y = el.y + el.h}
    })
    this.x = min.x
    this.y = min.y
    this.w = max.x - min.x
    this.h = max.y - min.y
  }
  place(ref,mode,options){
    // const dif = this.difOrigin(ref)
    const before = {x : this.x, y : this.y}
    const { x, y } = super.place(ref,mode,options)
    const dx = mode.includes('x') ? x - before.x : 0, dy = mode.includes('y') ? y - before.y : 0
    // console.log('Dif',dif);
    this.move(null,null,dx,dy)
    return this
  }
  set(ref,mode,options){
    this.place(ref,mode,options)
    return this.add()
  }
  move(x,y,dx,dy){
    this.elements.forEach(el => el.move(x,y,dx,dy))
    this.calcSpace()
    return this
  }
  add(){
    this.elements.forEach(el => el.add())
    return this
  }
  alignElements(mode){
    this.elements.forEach(el => {
      if(mode === 'cx'){
        el.move(null,null,(el.w-this.w/2),0)
      }else if(mode === 'cy'){
        el.move(null,null,0,(el.h-this.h/2))
      }
    })
    return this.calcSpace()
  }
  calcSpace(){
    let min = {x : null, y : null}
    let max = {x : null, y : null}
    this.elements.forEach(el => {
      // el.log()
      min.x = startFromNull(min.x,el.x)
      min.y = startFromNull(min.y,el.y)
      max.x = startFromNull(max.x,el.x+el.w)
      max.y = startFromNull(max.y,el.y+el.h)
      if(el.x < min.x){min.x = el.x}
      if(el.x + el.w > max.x){max.x = el.x + el.w}
      if(el.y < min.y){min.y = el.y}
      if(el.y + el.h > max.y){max.y = el.y + el.h}
    })
    this.x = min.x
    this.y = min.y
    this.w = max.x - min.x
    this.h = max.y - min.y
    return this
  }
  log(){
    console.log(`-------- Group Elements: ${this.elements.length}  --------`);
    console.log('X/Y: ',this.x,this.y);
    console.log('W/H: ',this.w,this.h);
    console.log('-------------------------------------');
    this.elements.forEach(el => {
      el.log()
      console.log('-------------------------------------');
    })
    console.log('-------------------------------------');
    return this
  }
}

module.exports = Canvas
