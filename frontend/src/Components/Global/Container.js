import React from "react"
import "./Container.css"

const Container = props => {
    return (
        <div className="container">
            <div className="details">
                <h1>{props.details}</h1>
                <h3>{props.description}</h3>
            </div>

            {props.component}
        </div>
    )
}


export default Container