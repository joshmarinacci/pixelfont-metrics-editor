import React, {useEffect, useRef, useState} from 'react'
import * as PropTypes from 'prop-types'
import {EVENTS} from './datastore.js'
import {HBox, VBox} from './util.js'

function MetricEditor({datastore, glyph, name}) {
    return <HBox>
        <label>{name}</label>
        <input type={"number"} value={glyph[name]} onChange={(e)=>{
            datastore.set_glyph_metric(glyph.id,name,e.target.valueAsNumber)
        }}/>
    </HBox>
}

MetricEditor.propTypes = {name: PropTypes.string}

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
        <MetricEditor glyph={glyph} name={"baseline"} datastore={datastore}/>
        <MetricEditor glyph={glyph} name={"ascent"} datastore={datastore}/>
        <MetricEditor glyph={glyph} name={"descent"} datastore={datastore}/>
        <MetricEditor glyph={glyph} name={"left"} datastore={datastore}/>
        <MetricEditor glyph={glyph} name={"right"} datastore={datastore}/>
    </VBox>
}

export function GlyphCanvas({datastore, selected}) {
    let ref = useRef()
    const [zoom, set_zoom] = useState(5)
    let scale = Math.pow(2,zoom)

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

        c.strokeStyle = 'blue'
        c.beginPath()
        //baseline
        c.moveTo(0,g.baseline*scale)
        c.lineTo(g.width*scale,g.baseline*scale)
        //ascent
        c.moveTo(0,(g.baseline-g.ascent)*scale)
        c.lineTo(g.width*scale,(g.baseline-g.ascent)*scale)
        //descent
        c.moveTo(0,(g.baseline+g.descent)*scale)
        c.lineTo(g.width*scale,(g.baseline+g.descent)*scale)
        //left
        c.moveTo(g.left*scale,0)
        c.lineTo(g.left*scale,g.height*scale)
        //right
        c.moveTo((g.width-g.right)*scale,0*scale)
        c.lineTo((g.width-g.right)*scale,g.height*scale)
        c.stroke()
    }

    useEffect(()=>{
        if(ref.current) draw_canvas(ref.current,selected)
    },[selected,zoom])
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
        <HBox>
            <button onClick={()=>set_zoom(zoom+1)}>zoom in</button>
            <button onClick={()=>set_zoom(zoom-1)}>zoom out</button>
        </HBox>
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
