import React from 'react'

export const MetricsList = ({stuff, setGlobal, set}) => {
    let metrics = stuff.metrics
    return <ul className={'scroll grow'}>
        <li>
            <label>offset</label>
            <input type="number" value={stuff.offset} onChange={(e) => {
                stuff.offset = parseInt(e.target.value)
                setGlobal('offset', stuff.offset)
            }}/>
        </li>
        {metrics.map((metrics, i) => {
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
                />
            </li>
        })}
    </ul>
}