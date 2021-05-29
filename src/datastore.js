/*

add glyphs one at a time, stored as separate bitmap data in JSON
store as list of booleans. just black and white
list of glphs, sorted by UTF-8 code
default glyph size
import and export via JSON upload


 */

export const EVENTS = {
    GLYPHS_CHANGED:"GLYPHS_CHANGED",
    GLYPH_UPDATED:"GLYPH_UPDATED",
}
export class Datastore {
    constructor() {
        this.glyphs = []
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
        this.log("firing",type)
        this.listeners(type).forEach(cb => cb(payload))
    }

    load_from_json() {

    }
    export_to_json() {

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
            data:arr
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
        return this.glyphs.slice().map(glyph => ({id:glyph.id,name:glyph.name}))
    }

    find_glyph_by_id(id){
        return this.glyphs.find(g => g.id === id)
    }

    set_glyph_pixel(id,pt) {
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

    log(...args) {
        console.log("DATASTORE",...args)
    }
}
