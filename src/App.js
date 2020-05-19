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
    console.log("mx is",stuff.count,m.x)
    return m
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


function addCategory(stuff, cat) {
    console.log("adding category", cat)
    if(cat === 'numbers') {
        for (let ch = 48; ch <= 57; ch++) {
            stuff.metrics[ch] = make_metric(ch, stuff)
            stuff.count++
        }
    }
    if(cat === 'uppercase') {
        for (let ch = 65; ch <= 90; ch++) {
            stuff.metrics[ch] = make_metric(ch, stuff)
            stuff.count++
        }
    }
    if(cat === 'lowercase') {
        for (let ch = 97; ch <= 122; ch++) {
            stuff.metrics[ch] = make_metric(ch, stuff)
            stuff.count++
        }
    }
    if(cat === 'punctuation') {
        let chars = []
        for (let ch = 32; ch <= 47; ch++) chars[ch] = ch
        for (let ch = 58; ch <= 64; ch++) chars[ch] = ch
        for (let ch = 91; ch <= 96; ch++) chars[ch] = ch
        for (let ch = 123; ch <= 126; ch++) chars[ch] = ch
        chars.forEach(ch => {
            stuff.metrics[ch] = make_metric(ch, stuff)
            stuff.count++
        })
    }
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
    let onAddCategory = cat => {
        addCategory(stuff,cat)
        setCounter(counter+1)
    }

    return (
        <FillBox>
            <div className="vbox">
                <MetricsControlPanel
                    stuff={stuff}
                    onLoadImage={onLoadImage} onLoadJSON={onLoadJSON}
                    onAddCategory={onAddCategory}
                />
                <MetricsList stuff={stuff} set={set} setGlobal={setGlobal}/>
            </div>
            <div className={"vbox grow"}>
                <HBox>
                    <button onClick={()=>setScale(scale+1)}>+</button>
                    <label>{Math.pow(2,scale)}</label>
                    <button onClick={()=>setScale(scale-1)}>-</button>
                </HBox>
                <MetricsCanvas stuff={stuff}
                               counter={counter}
                               sc={Math.pow(2,scale)}
                               image={image}/>
                <ExportPanel stuff={stuff} counter={counter}/>
            </div>
        </FillBox>
    );
}



export default App;
