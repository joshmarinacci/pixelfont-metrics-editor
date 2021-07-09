import * as PropTypes from 'prop-types'
import React, {useEffect, useRef, useState} from 'react'
import {EVENTS} from './datastore.js'

function GlyphListItem({glyph, selected, setSelected}) {
    return <li onClick={()=>setSelected(glyph)} style={{
        backgroundColor:selected===glyph?"aqua":"white"
    }}>
        {glyph.id} - {glyph.name}
    </li>
}

GlyphListItem.propTypes = {children: PropTypes.node}

export function GlyphList({datastore, selected, setSelected}) {
    const [gs, set_gs] = useState([])
    let ref = useRef()

    useEffect(()=>{
        let h = () => { set_gs(datastore.get_sorted_glyphs_names()) }
        datastore.on(EVENTS.GLYPHS_CHANGED,h)
        return ()=>{ datastore.off(EVENTS.GLYPHS_CHANGED,h) }
    })
    useEffect(() => {
        if(ref.current) {
            let n = gs.indexOf(selected)
            if(n >= 0) ref.current.children[n].scrollIntoView(false, {block: "nearest"})
        }
    },[selected])
    return <div className={"scroll"}>
        <ul ref={ref}
            className={"glyph-list"}
            tabIndex={0}
            onKeyDown={e => {
                if(e.key === "ArrowDown") {
                    let n = gs.indexOf(selected)
                    if(n < gs.length-1) {
                        n++
                        setSelected(gs[n])
                        e.stopPropagation()
                        e.preventDefault()
                    }
                }
                if(e.key === 'ArrowUp') {
                    let n = gs.indexOf(selected)
                    if(n > 0) {
                        n--
                        setSelected(gs[n])
                        e.stopPropagation()
                        e.preventDefault()
                    }
                }
            }}
        >{ gs.map(g => <GlyphListItem key={g.id} glyph={g} selected={selected} setSelected={setSelected}/>) }</ul>
    </div>
}

GlyphList.propTypes = {datastore: PropTypes.any}
