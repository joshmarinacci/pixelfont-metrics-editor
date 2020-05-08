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
                ctx.strokeStyle = 'yellow'
                ctx.strokeRect((stuff.offset + m.x) * sc,
                    m.y * sc,
                    m.w * sc,
                    m.h * sc)
                let size = 30
                ctx.font = `${size}px bold sans-serif`
                ctx.fillStyle = 'white'
                ctx.fillText(m.ch, (stuff.offset + m.x) * sc + 10, m.y * sc + size)
                ctx.fillStyle = 'magenta'
                ctx.fillText(m.ch, (stuff.offset + m.x) * sc + 10 + 1, m.y * sc + size + 1)
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
