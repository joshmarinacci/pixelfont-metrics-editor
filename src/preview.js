import React, {useEffect, useRef, useState} from 'react'
import {HBox} from './util.js'
import * as PropTypes from 'prop-types'
import {EVENTS} from './datastore.js'

function draw_glyph(c, g, x) {
    c.save()
    c.translate(x-g.left,g.height-g.baseline)
    for(let i=0; i<g.width; i++) {
        for(let j=0; j<g.height; j++) {
            let pix = g.data[i+j*g.width]
            if(pix > 0) c.fillRect(i,j,1,1)
        }
    }
    c.restore()
    return g.width-g.left-g.right
}

function draw_box(c, g, x) {
    c.save()
    c.translate(x,0)
    c.fillStyle = 'red'
    c.fillRect(0,0,8,8)
    c.restore()
    return 10
}

function draw(can, text, datastore) {
    let c = can.getContext('2d')
    c.fillStyle = 'white'
    c.fillRect(0,0,can.width,can.height)
    c.imageSmoothingEnabled = false
    c.fillStyle = 'black'
    for(let i=0; i<text.length; i++) {
        c.fillText(text[i],i*10,10)
    }
    c.save()
    c.translate(0,20)
    c.scale(8,8)
    c.strokeStyle = 'aqua'
    c.lineWidth = 0.5
    c.beginPath()
    c.moveTo(0,10-0.5)
    c.lineTo(100,10-0.5)
    c.stroke()
    let x = 0
    for(let i=0; i<text.length; i++) {
        let cp = text.codePointAt(i)
        let g = datastore.find_glyph_by_id(cp)
        if(g) {
            x += draw_glyph(c,g,x)
        } else {
            x += draw_box(c,g,x)
        }
    }
    c.restore()
}

export function PixelPreview({datastore, selected}) {
    let [text, set_text] = useState("ABC 123 abc")
    let ref = useRef()
    useEffect(()=>{
        if (ref.current) draw(ref.current,text,datastore)
    },[ref,text])

    useEffect(()=>{
        let h = () => draw(ref.current,text,datastore)
        datastore.on(EVENTS.GLYPH_UPDATED,h)
        return ()=>datastore.off(EVENTS.GLYPH_UPDATED,h)
    })

    function insert_selected_glyph() {
        if(!selected) return
        set_text(text+String.fromCodePoint(selected.id))
    }

    return <div>
        <HBox>pixel preview</HBox>
        <HBox>
            <input type={'input'} value={text} onChange={evt => set_text(evt.target.value)}/>
            <button onClick={insert_selected_glyph}>insert {selected?selected.name:"nothing selected"}</button>
        </HBox>
        <HBox>
            <canvas className={'preview-canvas'} ref={ref} width={64*8} height={64*2}
                    style={{
                        border:'1px solid black',
                    }}
            />
        </HBox>
    </div>
}

PixelPreview.propTypes = {
    stuff: PropTypes.shape({
        default_height: PropTypes.func,
        descent: PropTypes.func,
        default_width: PropTypes.func,
        ascent: PropTypes.func,
        image_height: PropTypes.number,
        count: PropTypes.func,
        image_width: PropTypes.number
    })
}
