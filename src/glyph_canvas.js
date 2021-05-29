import React, {useEffect, useRef} from 'react'
import * as PropTypes from 'prop-types'


export function GlyphCanvas({datastore, selected}) {
    let ref = useRef()

    function draw_canvas(can,selected) {
        let c = can.getContext('2d')
        c.fillStyle = 'red'
        c.fillRect(0,0,can.width,can.height)
        if(!selected) return
        c.strokeStyle = 'black'
        let g = datastore.find_glyph_by_id(selected.id)
        console.log('draw the canvas',g)
    }

    useEffect(()=>{
        if(ref.current) {
            draw_canvas(ref.current,selected)
        }
    },[selected])
    return <div style={{
        border:'1px solid black'
    }}>
        <canvas width={300} height={300} ref={ref}/>
    </div>
}

GlyphCanvas.propTypes = {
    datastore: PropTypes.any,
    selected: PropTypes.any
}
