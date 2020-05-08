import React, {useEffect, useRef} from 'react'

export const MetricsCanvas = ({stuff, counter, sc, image}) => {
    let ref = useRef()
    useEffect(() => {
        if (ref.current) {
            let ctx = ref.current.getContext('2d')
            ctx.fillStyle = 'white'
            ctx.fillRect(0,0,ref.current.width,ref.current.height)
            ctx.imageSmoothingEnabled = false

            ctx.save()
            ctx.scale(sc, sc)
            if (image) ctx.drawImage(image, 0, 0)
            ctx.restore()

            ctx.save()

            stuff.metrics.forEach(m => {

                // glyph bounds
                [['white',-1],['white',1],['black',0]].forEach(([col,i])=>{
                    ctx.strokeStyle = col
                    ctx.strokeRect(
                        (stuff.offset + m.x) * sc + i,
                        m.y * sc + i,
                        m.w * sc,
                        m.h * sc)
                });

                [['white',-1],['white',1],['red',0]].forEach(([col,i])=>{
                    // glyph char
                    let size = 24
                    ctx.font = `${size}px bold sans-serif`
                    ctx.fillStyle = col
                    ctx.fillText(m.ch, (stuff.offset + m.x) * sc + 10+i, m.y * sc + size +i)
                });
            })

            ctx.restore()
        }
    }, [ref, counter, sc, stuff, image])
    if (image) {
        console.log("image is loaded")
        return <div className={'scroll metrics-canvas'}>
            <canvas ref={ref} width={image.width * sc} height={image.height * sc}></canvas>
        </div>
    } else {
        return <div className={'scroll metrics-canvas'}>
            <canvas ref={ref} width={600 * sc} height={100}></canvas>
        </div>
    }
}
