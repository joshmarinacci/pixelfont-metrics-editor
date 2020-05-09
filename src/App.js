import React, {useState} from 'react'
import './App.css'
import {MetricsCanvas} from './MetricsCanvas.js'
import {MetricsControlPanel} from './MetricsSetupPanel.js'
import {FillBox, HBox} from './util.js'
import {MetricsList} from './MetricsList.js'

function setif(obj, key, backup) {
    if(obj && obj.hasOwnProperty(key)) return obj[key]
    return backup
}
function generateStuff(img,data) {
    let stuff = {
        offset: setif(data,'offset',0),
        includes_punc: setif(data,'includes_punc',true),
        includes_numbers: setif(data,'includes_numbers',true),
        includes_alpha_upper: setif(data,'includes_alpha_upper',true),
        includes_alpha_lower: setif(data,'includes_alpha_lower',true),
        default_width: setif(data,'default_width',10),
        default_height: setif(data,'default_height',10),
        ascent: setif(data,'ascent',8),
        descent: setif(data,'descent',2),
    }
    if(data) {
        stuff.metrics = data.metrics
    } else {
        updateStuff(stuff, img)
    }
    stuff.metrics.forEach(m => {
        if(!m) return
        if(!m.hasOwnProperty('baseline')) {
            m.baseline = 0
        }
    })
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
        return {num: i, x: 0, y: 0, w: stuff.default_width, h: stuff.default_height, blank: false, ch: String.fromCharCode(i), baseline:0}
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

function generateOutput(stuff) {
    return JSON.stringify(stuff,null,'  ')
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
    let [scale, setScale] = useState(3)
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
                setStuff(generateStuff(img,null))
            }
            img.src = URL.createObjectURL(evt.target.files[0])
        }
    }

    let onLoadJSON = evt => {
        fetch(URL.createObjectURL(evt.target.files[0])).then(res=>res.json()).then(data=>{
            setStuff(generateStuff(image,data))
        })
    }
    let onControlChange = () => {
        console.log('changing')
        updateStuff(stuff,image)
        setCounter(counter+1)
    }

    return (
        <FillBox>
            <div className="vbox">
                <MetricsControlPanel stuff={stuff} onLoadImage={onLoadImage} onLoadJSON={onLoadJSON} onChange={onControlChange}/>
                <MetricsList stuff={stuff} set={set} setGlobal={setGlobal}/>
            </div>
            <div className={"vbox grow"}>
                <HBox>
                    <button onClick={()=>setScale(scale+1)}>+</button>
                    <label>{Math.pow(2,scale)}</label>
                    <button onClick={()=>setScale(scale-1)}>-</button>
                </HBox>
                <MetricsCanvas stuff={stuff} counter={counter} sc={Math.pow(2,scale)} image={image}/>
                <ExportPanel stuff={stuff} counter={counter}/>
            </div>
        </FillBox>
    );
}



export default App;
