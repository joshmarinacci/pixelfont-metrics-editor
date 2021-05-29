import * as PropTypes from 'prop-types'
import React, {useEffect, useState} from 'react'
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
    useEffect(()=>{
        let h = () => { set_gs(datastore.get_sorted_glyphs_names()) }
        datastore.on(EVENTS.GLYPHS_CHANGED,h)
        return ()=>{ datastore.off(EVENTS.GLYPHS_CHANGED,h) }
    })
    return <ul className={"glyph-list"}>{ gs.map(g => <GlyphListItem key={g.id} glyph={g} selected={selected} setSelected={setSelected}/>) }</ul>
}

GlyphList.propTypes = {datastore: PropTypes.any}
