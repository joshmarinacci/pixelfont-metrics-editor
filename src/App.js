import React, {useEffect, useRef, useState} from 'react'
import './App.css'
import {MetricsCanvas} from './MetricsCanvas.js'
import {MetricsControlPanel} from './MetricsSetupPanel.js'
import {FillBox, HBox} from './util.js'
import {MetricsList} from './MetricsList.js'
import * as PropTypes from 'prop-types'

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


function addCategory(stuff, cat) {
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

function PixelPreview({stuff, image, counter}) {
    let [text, set_text] = useState("preview text")
    let ref = useRef()
    useEffect(()=>{
        if (ref.current) {
            let ctx = ref.current.getContext('2d')
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, ref.current.width, ref.current.height)
            ctx.imageSmoothingEnabled = false
            if(image && stuff) draw_text(ctx,stuff,text,image)
        }
    },[ref,text,stuff,image,counter])
    return <div>
        <HBox>pixel preview</HBox>
        <HBox>
            <input type={'input'} value={text} onChange={evt => set_text(evt.target.value)}/>
        </HBox>
        <HBox>
            <canvas className={'preview-canvas'} ref={ref} width={64*4} height={64}/>
        </HBox>
    </div>
}

PixelPreview.propTypes = {
    stuff: PropTypes.shape({
        default_height: PropTypes.func,
        descent: PropTypes.func,
        default_width: PropTypes.func,
        ascent: PropTypes.func,
        image_height: PropTypes.number,
        count: PropTypes.func,
        image_width: PropTypes.number
    })
}

function App() {
    let [stuff,setStuff] = useState(()=>generateStuff())
    let [counter,setCounter] = useState(0)
    let [image,setImage] = useState(null)
    let [name, setName] = useState("")
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
            let name = evt.target.files[0].name
            let img = new Image()
            img.onload = () => {
                setImage(img)
                setStuff(generateStuff(img,null))
                setName(name)
            }
            img.src = URL.createObjectURL(evt.target.files[0])
        }
    }
    let onLoadJSON = evt => {
        fetch(URL.createObjectURL(evt.target.files[0]))
            .then(res=>res.json())
            .then(data=> setStuff(generateStuff(image,data)))
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
                    name={name}
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
                <PixelPreview stuff={stuff} counter={counter} image={image}/>
                <ExportPanel stuff={stuff} counter={counter} name={name}/>
            </div>
        </FillBox>
    );
}



export default App;
