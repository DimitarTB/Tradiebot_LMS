import React from 'react'

const VideoBrowser = props =>{

    // tracking functions //

    return (
        <div className="video-player">
            {props.lecture?.name}
        </div>
    )
}


export default VideoBrowser
