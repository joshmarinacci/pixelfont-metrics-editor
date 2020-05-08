import React, {useState} from 'react'
import './App.css'
import {MetricsCanvas} from './MetricsCanvas.js'
import {MetricsControlPanel} from './MetricsSetupPanel.js'
import {HBox} from './util.js'

function generateStuff(img) {
    let stuff = {
        offset: 0,
        includes_punc: true,
        includes_numbers: true,
        includes_alpha_upper: true,
        includes_alpha_lower: true,
        default_width: 10,
        default_height: 10,
    }
    updateStuff(stuff,img)
    return stuff
}
function updateStuff(stuff, img) {
    // let metrics = []
    let chars = []
    if (stuff.includes_punc) {
        for (let i = 32; i <= 47; i++) {
            chars[i] = i
        }
        for (let i = 58; i <= 64; i++) {
            chars[i] = i
        }
        for (let i = 91; i <= 96; i++) {
            chars[i] = i
        }
        for (let i = 123; i <= 126; i++) {
            chars[i] = i
        }
    }
    if (stuff.includes_numbers) {
        for (let i = 48; i <= 57; i++) {
            chars[i] = i
        }
    }
    if (stuff.includes_alpha_upper) {
        for (let i = 65; i <= 90; i++) {
            chars[i] = i
        }
    }
    if (stuff.includes_alpha_lower) {
        for (let i = 97; i <= 122; i++) {
            chars[i] = i
        }
    }

    let metrics = chars.map(i => {
        if(!i) return null
        return {num: i, x: 0, y: 0, w: stuff.default_width, h: stuff.default_height, blank: false, ch: String.fromCharCode(i)}
    })

    let ct = 0
    metrics.forEach(m => {
        if (!m) return
        if(img) {
            m.x = ct * stuff.default_width
            if(m.x >= img.width) {
                m.x = (ct * stuff.default_width)%img.width
                m.y = Math.floor((ct *stuff.default_width)/img.width)*stuff.default_height
            }

        } else {
            m.x = ct * stuff.default_width
        }
        ct++
    })

    stuff.metrics = metrics
}

const MetricsList = ({stuff, setGlobal, set})=>{
    let metrics = stuff.metrics
    return <ul>
        <li>
            <label>offset</label>
            <input type="number" value={stuff.offset} onChange={(e)=>{
                stuff.offset = parseInt(e.target.value)
                setGlobal('offset',stuff.offset)
            }}/>
        </li>
        {metrics.map((metrics,i) => {
            return <li key={i}>
                <label>{metrics.ch}</label>
                <label>x</label>
                <input type="number" value={metrics.x}
                       onChange={(e)=>set(metrics.num,'x',parseFloat(e.target.value))}/>
                {/*<label>y</label>*/}
                {/*<input type="number" value={metrics.y}/>*/}
                <label>w</label>
                <input type="number" value={metrics.w}
                       onChange={(e)=>set(metrics.num,'w',parseInt(e.target.value))}/>
                {/*<label>h</label>*/}
                {/*<input type="number" value={metrics.h}/>*/}
            </li>
        })}
    </ul>
}

function generateOutput(stuff) {
    let obj = {
        offset:stuff.offset,
        metrics:stuff.metrics,
    }
    return JSON.stringify(obj,null,'  ')
}

const ExportPanel = ({stuff, counter})=>{
    let [ep,setEp] = useState("foo")
    return <div className={'vbox'}>
        <button onClick={()=>setEp(generateOutput(stuff))}>export</button>
        <textarea className={'export-area'} value={ep}/>
    </div>
}


function App() {
    let [stuff,setStuff] = useState(()=>generateStuff())
    let [counter,setCounter] = useState(0)
    let [image,setImage] = useState(null)
    let set = (num, prop, value) => {
        stuff.metrics[num][prop] = value
        setCounter(counter+1)
    }
    let setGlobal = (name) => {
        setCounter(counter+1)
    }

    let onLoadImage = (evt) => {
        if(evt.target.files && evt.target.files.length >= 1) {
            let img = new Image()
            img.onload = () => {
                console.log("fully loaded the image")
                setImage(img)
                setStuff(generateStuff(img))
            }
            img.src = URL.createObjectURL(evt.target.files[0])
        }
    }
    let onControlChange = () => {
        console.log('changing')
        updateStuff(stuff,image)
        setCounter(counter+1)
    }

    return (
        <HBox>
            <div className="vbox">
                <MetricsControlPanel stuff={stuff} onLoadImage={onLoadImage} onChange={onControlChange}/>
                <MetricsList stuff={stuff} set={set} setGlobal={setGlobal}/>
            </div>
            <div className={"vbox"}>
                <MetricsCanvas stuff={stuff} counter={counter} sc={5} image={image}/>
                <ExportPanel stuff={stuff} counter={counter}/>
            </div>
        </HBox>
    );
}



export default App;
