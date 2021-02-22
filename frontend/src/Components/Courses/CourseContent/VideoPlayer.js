import React from 'react'

const VideoPlayer = props => {

    // tracking functions //

    return (
        <div className="video-player">
            <iframe src={props.url} width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
        </div>
    )
}


export default VideoPlayer
