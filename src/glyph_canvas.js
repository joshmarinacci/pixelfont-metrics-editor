import React, {useEffect, useRef, useState} from 'react'
import * as PropTypes from 'prop-types'
import {EVENTS} from './datastore.js'
import {HBox, VBox} from './util.js'

function MetricsPanel({datastore, selected}) {
    const [count, setcount] = useState(0)
    useEffect(()=>{
        let h = () => setcount(count+1)
        datastore.on(EVENTS.GLYPH_UPDATED,h)
        return ()=>datastore.off(EVENTS.GLYPH_UPDATED,h)
    })
    if(!selected) return <HBox>nothing selected</HBox>
    let glyph = datastore.find_glyph_by_id(selected.id)
    return <VBox>
        <HBox>
            <label>left</label>
            <input type={"number"} value={glyph.left} onChange={(e)=>{
                datastore.set_glyph_metric(selected.id,'left',e.target.valueAsNumber)
            }}/>
        </HBox>
        <HBox>
            <label>ascent</label>
            <input type={"number"} value={glyph.ascent} onChange={(e)=>{
                datastore.set_glyph_metric(selected.id,'ascent',e.target.valueAsNumber)
            }}/>
        </HBox>
    </VBox>
}

export function GlyphCanvas({datastore, selected}) {
    let ref = useRef()
    const [scale, set_scale] = useState(20)

    function draw_canvas(can,selected) {
        if(!can) return
        let c = can.getContext('2d')
        c.fillStyle = 'red'
        c.fillRect(0,0,can.width,can.height)
        if(!selected) return
        c.strokeStyle = 'black'
        let g = datastore.find_glyph_by_id(selected.id)
        for(let i=0; i<g.width; i++) {
            for(let j=0; j<g.height; j++) {
                let v = g.data[j*g.width+i]
                if(v === 1) {
                    c.fillStyle = 'black'
                } else {
                    c.fillStyle = 'white'
                }
                c.fillRect(i*scale,j*scale,scale,scale)
            }
        }

        c.strokeStyle = 'red'
        //draw left
        c.beginPath()
        c.moveTo(g.left*scale,0)
        c.lineTo(g.left*scale,can.height)
        c.stroke()
    }

    useEffect(()=>{
        if(ref.current) draw_canvas(ref.current,selected)
    },[selected])
    useEffect(()=>{
        let h = () => draw_canvas(ref.current,selected)
        datastore.on(EVENTS.GLYPH_UPDATED,h)
        return ()=>datastore.off(EVENTS.GLYPH_UPDATED,h)
    })

    function set_pixel(e) {
        let rect = e.target.getBoundingClientRect()
        let pt = {
            x:Math.floor((e.clientX-rect.left)/scale),
            y:Math.floor((e.clientY-rect.top)/scale),
        }
        datastore.set_glyph_pixel(selected.id,pt)
    }

    return <div style={{
        border:'1px solid black'
    }}>
        <canvas width={300} height={300} ref={ref}
                onMouseDown={(e)=>set_pixel(e)}
        />
        <MetricsPanel datastore={datastore} selected={selected}/>
    </div>
}

GlyphCanvas.propTypes = {
    datastore: PropTypes.any,
    selected: PropTypes.any
}
