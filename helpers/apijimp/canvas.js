const jimp = require('jimp')

class Square{
  constructor(x,y,w,h){
    this.x = x || 0
    this.y = y || 0
    this.w = w || 0
    this.h = h || 0
  }
  place(ref,mode,options){
    if(!ref){throw new Error('Referencia no encontrada')}
    options.x = options.x || 0
    options.y = options.y || 0
    if(mode.includes('lx')){
        this.x = ref.x + options.x
    }else if(mode.includes('rx')){
        this.x = ref.x + ref.w + options.x
    }else if(mode.includes('cx')){
        this.x = ref.x + (ref.w-this.w)/2 + options.x
    }else if(mode.includes('gxl')){
      this.x = ref.x + options.x
    }else if(mode.includes('gxr')){
      // ref.log()
      // this.log()
      // console.log(ref.x,ref.w,this.w,options.x);
      this.x = ref.x + ref.w - this.w - options.x
      // console.log('THIS.X',this.x);
    }
    if(mode.includes('ty')){
        this.y = ref.y + options.y
    }else if(mode.includes('by')){
        this.y = ref.y + ref.h + options.y
    }else if(mode.includes('cy')){
        this.y = ref.y + (ref.h-this.h)/2 + options.y
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

function textWidth(text,font){
  const chars = text.split('');
  let size = 0
  chars.forEach(c => {
    size += font.chars[c] ? font.chars[c].xadvance : 0
  })
  return size
}

const elementsTypes = ['image','text','ref']

class Element extends Square{
  constructor(type,name,data){
    super(data.x,data.y,data.w,data.h)
    if(!elementsTypes.includes(type)){ throw new Error('Element not compatible with type:',type)}
    this.type = type
    this.name = name
    this.canvas = data.canvas
    // console.log('CREATE ELEMENT,',this.name,!this.canvas);
    if(!this.canvas){console.log('Element NO BASE: ',this.name);}
    if(type === 'image'){
      this.img = data.img
      this.w = data.img.bitmap.width
      this.h = data.img.bitmap.height
    }else if(type === 'text'){
      this.font = data.font
      // console.log('TEXT ELEMENT: Font',this.name,this.font ? true : false);
      // console.log(this.font);
      this.text = data.text
      this.w = textWidth(this.text,this.font)
      this.h = data.font.info.size
    }else if(type === 'ref'){

    }
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
    data.canvas = this
    return new Element(type,name,data)
  }
  write(name,text,font){
    let data = {}
    data.text = text
    data.font = typeof(font === 'string') && this.fonts[font] ? this.fonts[font] : font
    return this.new('text',name,data)
  }
  paint(name,img,options){
    let data = Object.assign({img},options ? options : {})
    return this.new('image',name,data)
  }
  ref(name,data){
    return this.new('ref',name,data)
  }
  group(name,elements,data){
    return new Group(name,elements,this)
  }
  add(el){
    this.elements.push(el)
    return this
  }
  create(format){
    this.elements.forEach(el => {
      if(el.type === 'image'){
        this.base.composite(el.img,el.x,el.y)
      }else if(el.type === 'text'){
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
      // el.log()
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
    this.elements.forEach(e => e.move(x,y,dx,dy))
    this.calcSpace()
    return this
  }
  add(){
    this.elements.forEach(el => el.add())
    return this
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
