/*


use cases
create a new font: load an image, adjust global metrics
edit existing: load an image and json, adjust individual metrics
add glyph set: punctuation. append to end
add new standalone glyph. append to end
delete glyph set
delete standalone glyph

glyphs always sorted by char


 */
import React, {useRef} from 'react'
import {HBox} from './util.js'

export const MetricsControlPanel = ({stuff: data, onLoadImage, onLoadJSON, onAddCategory}) => {
    let cat = useRef()
    return <div className={"vbox"}>
        <HBox>
            <label>Image</label> <input type="file" onChange={onLoadImage}/>
        </HBox>
        <HBox>
            <label>JSON</label> <input type="file" onChange={onLoadJSON}/>
        </HBox>

        {/*<HBox>*/}
        {/*    <label>default width</label>*/}
        {/*    <input type="number" value={data.default_width} onChange={(e)=>{*/}
        {/*        data.default_width = parseInt(e.target.value)*/}
        {/*        onChange(data)*/}
        {/*    }}/>*/}
        {/*    <label> height</label>*/}
        {/*    <input type="number" value={data.default_height} onChange={(e)=>{*/}
        {/*        data.default_height = parseInt(e.target.value)*/}
        {/*        onChange(data)*/}
        {/*    }}/>*/}
        {/*</HBox>*/}
        {/*<HBox>*/}
        {/*    <label>line-height</label>*/}
        {/*    <input type="number" value={10} />*/}
        {/*</HBox>*/}
        {/*<HBox>*/}
        {/*    <label>ascent</label>*/}
        {/*    <input type="number" value={data.ascent}/>*/}
        {/*</HBox>*/}
        {/*<HBox>*/}
        {/*    <label>descent</label>*/}
        {/*    <input type="number" value={data.descent}/>*/}
        {/*</HBox>*/}
        <HBox>
            <label>category</label>
            <select ref={cat}>
                <option value={'invalid'}>choose...</option>
                <option value={'uppercase'}>uppercase</option>
                <option>lowercase</option>
                <option>numbers</option>
                <option>punctuation</option>
            </select>
            <button onClick={()=>onAddCategory(cat.current.value)}>add</button>
        </HBox>
    </div>
}
