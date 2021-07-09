import React from 'react'

export const HBox = ({children, grow=false, stretch=false}) => {
    return <div className={clss({
        hbox:true,
        grow,
        stretch
    })}>{children}</div>
}

function clss(param) {
    return Object.entries(param).map(([key,value])=> value?key:null)
        .join(" ")

}

export const VBox = ({children, grow=false, stretch=false}) => {
    return <div className={clss({vbox:true, grow, stretch})}>{children}</div>
}

export const FillBox = ({children}) => {
    return <div className={"fillbox"}>{children}</div>
}
