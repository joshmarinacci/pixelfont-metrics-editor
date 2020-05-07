import React, {useEffect, useRef, useState} from 'react'
import './App.css';

let img = new Image()
img.src = "BitScript.png"
let stuff = {
    offset:10,
}
let metrics = []
for(let i=65; i<90; i++) {
    metrics[i] = {num:i, x:(i-65)*8, y:0, w:8, h:8, blank:false, ch:String.fromCharCode(i)}
}
stuff.metrics = metrics

const MetricsList = ({stuff, setGlobal, set})=>{
    let metrics = stuff.metrics
    console.log("rendering list")
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

const MetricsCanvas = ({stuff,counter,sc})=>{
    let ref = useRef()
    useEffect(()=>{
        if(ref.current) {
            let ctx = ref.current.getContext('2d')
            ctx.fillStyle = 'red'
            // ctx.fillRect(0,0,30,30)
            ctx.imageSmoothingEnabled = false

            ctx.save()
            ctx.scale(sc,sc)
            ctx.drawImage(img,0,0)
            ctx.restore()

            ctx.save()

            stuff.metrics.forEach(m => {
                ctx.strokeStyle = 'yellow'
                ctx.strokeRect((stuff.offset + m.x)*sc,
                    m.y*sc,
                    m.w*sc,
                    m.h*sc)
                ctx.fillStyle = 'magenta'
                ctx.fillText(m.ch, (stuff.offset+m.x)*sc+10, 1*sc+10)
            })

            ctx.restore()
        }
    },[ref,counter, sc, stuff])
    return <div className={'scroll'}>
        <canvas ref={ref} width={600*sc} height={100}></canvas>
    </div>
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
    let [m,setM] = useState(0)
    let set = (num, prop, value) => {
        metrics[num][prop] = value
        setM(m+1)
    }
    let setGlobal = (name) => {
        setM(m+1)
    }
  return (
      <div className="hbox">
          <MetricsList stuff={stuff} set={set} setGlobal={setGlobal}/>
          <div className={"vbox"}>
              <MetricsCanvas stuff={stuff} counter={m} sc={10}/>
              <ExportPanel stuff={stuff} counter={m}/>
          </div>
      </div>
  );
}



export default App;
