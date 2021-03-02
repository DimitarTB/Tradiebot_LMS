import React from 'react'

const VideoPlayer = props => {

    const video_url = "https://player.vimeo.com/video/" + props.url + "?color=ef0800&title=0&byline=0&portrait=0"
    // tracking functions //

    return (
        <div className="video-player">
            <iframe src={video_url} width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
        </div>
    )
}


export default VideoPlayer
