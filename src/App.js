import React, {useEffect, useRef, useState} from 'react'
import './App.css'
import {FillBox, HBox, VBox} from './util.js'
import * as PropTypes from 'prop-types'
import {Datastore} from './datastore.js'
import {GlyphList} from './glyph_list.js'
import {GlyphCanvas} from './glyph_canvas.js'
import {PixelPreview} from './preview.js'

let datastore = new Datastore()

function setif(obj, key, backup) {
    if(obj && obj.hasOwnProperty(key)) return obj[key]
    return backup
}
function generateStuff(img,data) {
    let stuff = {
        default_width: setif(data,'default_width',10),
        default_height: setif(data,'default_height',10),
        ascent: setif(data,'ascent',8),
        descent: setif(data,'descent',2),
        image_width:64,
        image_height:64,
        count:setif(data,'count',0),
    }
    if(img) {
        stuff.image_width = img.width
        stuff.image_height = img.height
    }
    stuff.metrics = data?data.metrics:[]
    return stuff
}

function make_metric(ch, stuff) {
    let m = {
        num: ch, x: 0, y: 0, w: stuff.default_width, h: stuff.default_height,
        blank: false, ch: String.fromCharCode(ch),
        baseline: 0
    }
    let ct = stuff.count
    m.x = ct * stuff.default_width
    if (m.x >= stuff.image_width) {
        m.x = (ct * stuff.default_width) % stuff.image_width
        m.y = Math.floor((ct * stuff.default_width) / stuff.image_width) * stuff.default_height
    }
    return m
}

function generateOutput(stuff) {
    return JSON.stringify(stuff,null,'  ')
}

function download(s,name) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(s)
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", name + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

const ExportPanel = ({stuff, counter,name})=>{
    let [ep,setEp] = useState("foo")
    return <div className={'vbox'}>
        <button onClick={()=>setEp(generateOutput(stuff))}>export</button>
        <button onClick={()=>download(generateOutput(stuff),name)}>download</button>
        <textarea className={'export-area'} value={ep}/>
    </div>
}

function draw_text(ctx, stuff, text, image) {
    let dx = 0
    let dy = 0
    let sc = 4;
    for(let i=0; i<text.length; i++) {
        let met = stuff.metrics[text.charCodeAt(i)]
        if(met) {
            ctx.drawImage(image, met.x,met.y,met.w,met.h, dx*sc,(dy+met.baseline)*sc, met.w*sc,met.h*sc);
            dx += met.w
            dx += 1
        } else {
            ctx.fillStyle = 'black'
            ctx.fillRect(dx*sc,dy*sc,10*sc,10*sc);
            dx += 10;
            dx += 1;
        }
    }
}


function AddGlyphPanel({datastore}) {
    const [codepoint, set_codepoint] = useState(65)
    const [name, set_name] = useState("A")
    return <HBox>
        <label>codepoint</label>
        <input type="number" value={codepoint} onChange={(e)=>set_codepoint(e.target.valueAsNumber)}/>
        <label>name</label>
        <input type="string" value={name} onChange={(e)=>{set_name(e.target.value)}}/>
        <button onClick={()=>{
            let gl = datastore.make_glyph(codepoint,name)
            datastore.add_glyph(gl)
            set_codepoint(65)
            set_name("A")
        }}>add glyph</button>
    </HBox>

}

AddGlyphPanel.propTypes = {datastore: PropTypes.any}

function App() {
    const [selected_glyph, set_selected_glyph] = useState(null)
    return (
        <FillBox>
            <VBox>
                <HBox>
                    <button onClick={()=>{
                        let json = datastore.export_to_json()
                        download(JSON.stringify(json,null,'   '),datastore.get_name())
                    }}>export</button>
                    <input type="file" onChange={(e)=>{
                        if(!e.target.files[0]) return
                        let name = e.target.files[0].name
                        fetch(URL.createObjectURL(e.target.files[0]))
                            .then(res=>res.json())
                            .then(data=> {
                                console.log('data is',data)
                                datastore.import_from_json(data)
                            }).catch(e => {
                                console.log("error",e)
                        })
                    }}/>
                </HBox>
                <AddGlyphPanel datastore={datastore}/>
                <HBox>
                    <GlyphList datastore={datastore} selected={selected_glyph} setSelected={set_selected_glyph}/>
                    <VBox>
                        <GlyphCanvas datastore={datastore} selected={selected_glyph}/>
                        <PixelPreview datastore={datastore}/>
                    </VBox>
                </HBox>
            </VBox>
        </FillBox>
    );
}



export default App;
