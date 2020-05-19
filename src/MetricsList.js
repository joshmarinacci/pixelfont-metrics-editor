import React from 'react'

export const MetricsList = ({stuff, setGlobal, set}) => {
    let metrics = stuff.metrics
    return <ul className={'scroll grow'}>
        {metrics.map((metrics, i) => {
            if(!metrics) return <div key={i}></div>
            return <li key={i}>
                <label>{metrics.ch}</label>
                <label>x</label>
                <input type="number" value={metrics.x}
                       onChange={(e) => set(metrics.num, 'x', parseFloat(e.target.value))}/>
                <label>y</label>
                <input type="number" value={metrics.y}
                       onChange={(e) => set(metrics.num, 'y', parseFloat(e.target.value))}/>
                <label>w</label>
                <input type="number" value={metrics.w}
                       onChange={(e) => set(metrics.num, 'w', parseInt(e.target.value))}/>
                <label>h</label>
                <input type="number" value={metrics.h}
                       onChange={(e) => set(metrics.num, 'h', parseFloat(e.target.value))}/>
                <label>bl</label>
                <input type="number" value={metrics.baseline}
                       onChange={(e) => set(metrics.num, 'baseline', parseFloat(e.target.value))}/>
            </li>
        })}
    </ul>
}
