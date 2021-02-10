import React from 'react'

import { AiFillPlayCircle } from 'react-icons/ai'

const VideoBrowser = props =>{

    const lectures = props.lectures.map(lecture => {
        return (
            <button onClick={e => {
                console.log(e)
                props.setSelectedLecture(lecture)
            }}>{lecture.name} <AiFillPlayCircle /></button>
        )
    })
    return (
        <div className="video-browser">
            {lectures}
        </div>
    )
}


export default VideoBrowser
