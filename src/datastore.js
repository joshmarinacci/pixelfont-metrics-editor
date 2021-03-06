/*
add glyphs one at a time, stored as separate bitmap data in JSON
list of glyphs, sorted by UTF-8 code
import and export via JSON upload
 */

export const EVENTS = {
    GLYPHS_CHANGED:"GLYPHS_CHANGED",
    GLYPH_UPDATED:"GLYPH_UPDATED",
}
export class Datastore {
    constructor() {
        this.glyphs = []
        this.name = "font"
    }
    on(type,cb) {
        this.listeners(type).push(cb)
    }
    listeners(type) {
        if(!this._listeners) this._listeners = {}
        if(!this._listeners[type]) {
            this._listeners[type] = []
            this._listeners[type].remove = function (v) {
                let n = this.indexOf(v)
                if(n >= 0) this.splice(n,1)
            }
        }
        return this._listeners[type]
    }
    off(type,cb) {
        this.listeners(type).remove(cb)
    }
    fire(type,payload) {
        this.listeners(type).forEach(cb => cb(payload))
    }
    import_from_json(data) {
        console.log("importing from",data)
        this.glyphs = data.glyphs
        this.name = data.name
        this.fire(EVENTS.GLYPHS_CHANGED)
    }
    export_to_json() {
        return {
            glyphs:this.glyphs.slice(),
            name:this.name
        }
    }

    get_name() {
        return this.name
    }
    make_glyph(id,name) {
        let arr = new Array(10*10)
        arr.fill(0)
        return {
            id:id,
            name:name,
            width:10,
            height:10,
            baseline:8,
            data:arr,
            ascent:8,
            descent:2,
            left:0,
            right:0,
        }
    }
    add_glyph(g) {
        this.glyphs.push(g)
        this.fire(EVENTS.GLYPHS_CHANGED,this.glyphs)
    }
    update_glyph(g) {
        this.fire(EVENTS.GLYPH_UPDATED,g)
    }
    get_sorted_glyphs_names() {
        let arr = this.glyphs.slice().map(glyph => ({id:glyph.id,name:glyph.name}))
        arr.sort((a,b)=>a.id-b.id)
        return arr
    }

    find_glyph_by_id(id){
        return this.glyphs.find(g => g.id === id)
    }

    get_glyph_pixel(id,pt) {
        let g = this.find_glyph_by_id(id)
        let n = pt.x + pt.y * g.width
        let v = g.data[n]
        return v
    }
    set_glyph_pixel(id,pt, v) {
        let g = this.find_glyph_by_id(id)
        let n = pt.x + pt.y * g.width
        g.data[n] = v
        this.update_glyph(g)
    }
    flip_glyph_pixel(id,pt) {
        let g = this.find_glyph_by_id(id)
        let n = pt.x + pt.y * g.width
        let v = g.data[n]
        if(v === 0) {
            v = 1
        } else {
            v = 0
        }
        g.data[n] = v
        this.update_glyph(g)
    }
    set_glyph_metric(id,name,value) {
        let g = this.find_glyph_by_id(id)
        if(name === "width" || name === "height") this.resize_glyph(g,name,value)
        g[name] = value
        this.update_glyph(g)
    }

    log(...args) {
        console.log("DATASTORE",...args)
    }

    resize_glyph(g,name,value) {
        let old_width = g.width
        let old_height = g.height
        let new_width = g.width
        let new_height = g.height
        if(name === 'width') new_width = value
        if(name === 'height') new_height = value
        let old_data = g.data.slice()
        let new_data = new Array(new_width*new_height)
        new_data.fill(0)
        for(let i=0; i<old_width; i++) {
            for(let j=0; j<old_height; j++) {
                let old_n = j*old_width+i
                let new_n = j*new_width+i
                if(i < new_width && j < new_height) {
                    new_data[new_n] = old_data[old_n]
                }
            }
        }
        g.data = new_data

    }
}
