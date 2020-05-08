import React from 'react'
import {HBox} from './util.js'

export const MetricsControlPanel = ({stuff, onLoadImage, onChange}) => {
    return <div className={"vbox"}>
        <HBox>
            <label>load image</label> <input type="file" onChange={onLoadImage}/>
        </HBox>
        <HBox>
            <label>punctuation</label> <input type="checkbox" checked={true}/>
        </HBox>
        <HBox>
            <label>numbers</label> <input type="checkbox" checked={true}/>
        </HBox>
        <HBox>
            <label>uppercase</label> <input type="checkbox" checked={true}/>
        </HBox>
        <HBox>
            <label>lowercase</label> <input type="checkbox" checked={true}/>
        </HBox>
        <HBox>
            <label> average width</label>
            <input type="number" value={8}/>
        </HBox>
        <HBox>
            <label>average height</label>
            <input type="number" value={stuff.default_height} onChange={(e)=>{
                console.log("changing")
                stuff.default_height = parseInt(e.target.value)
                onChange(stuff)
            }}/>
        </HBox>
        <HBox>
            <label>line-height</label>
            <input type="number" value={10}/>
        </HBox>
        <HBox>
            <label>ascent</label>
            <input type="number" value={6}/>
        </HBox>
        <HBox>
            <label>descent</label>
            <input type="number" value={2}/>
        </HBox>
        <HBox>
            <button>update</button>
        </HBox>
    </div>
}