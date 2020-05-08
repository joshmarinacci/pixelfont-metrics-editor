import React from 'react'
import {HBox} from './util.js'

export const MetricsControlPanel = ({stuff, onLoadImage, onLoadJSON, onChange}) => {
    return <div className={"vbox"}>
        <HBox>
            <label>load image</label> <input type="file" onChange={onLoadImage}/>
        </HBox>
        <HBox>
            <label>load JSON</label> <input type="file" onChange={onLoadJSON}/>
        </HBox>
        <HBox>
            <label>punctuation</label> <input type="checkbox" checked={stuff.includes_punc}
                                              onChange={(e)=>{
                                                  stuff.includes_punc = e.target.checked
                                                  onChange(stuff)
                                              }}
        />
        </HBox>
        <HBox>
            <label>numbers</label> <input type="checkbox" checked={stuff.includes_numbers}
                                          onChange={(e)=>{
                                              stuff.includes_numbers = e.target.checked
                                              onChange(stuff)
                                          }}
        />
        </HBox>
        <HBox>
            <label>uppercase</label> <input type="checkbox" checked={stuff.includes_alpha_upper}
                                            onChange={(e)=>{
                                                stuff.includes_alpha_upper = e.target.checked
                                                onChange(stuff)
                                            }}
        />
        </HBox>
        <HBox>
            <label>lowercase</label> <input type="checkbox" checked={stuff.includes_alpha_lower}
                                            onChange={(e)=>{
                                                stuff.includes_alpha_lower = e.target.checked
                                                onChange(stuff)
                                            }}
        />
        </HBox>
        <HBox>
            <label> average width</label>
            <input type="number" value={stuff.default_width} onChange={(e)=>{
                stuff.default_width = parseInt(e.target.value)
                onChange(stuff)
            }}/>
        </HBox>
        <HBox>
            <label>average height</label>
            <input type="number" value={stuff.default_height} onChange={(e)=>{
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
            <input type="number" value={stuff.ascent}/>
        </HBox>
        <HBox>
            <label>descent</label>
            <input type="number" value={stuff.descent}/>
        </HBox>
        <HBox>
            <button>update</button>
        </HBox>
    </div>
}
