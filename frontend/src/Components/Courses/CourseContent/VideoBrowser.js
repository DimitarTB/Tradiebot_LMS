import React, { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"

import { AiFillPlayCircle } from 'react-icons/ai'
import { createLecture } from '../../../redux/Lectures/LecturesActions'

const VideoBrowser = props => {

    console.log(props.lectures)
    // const lectures = props.lectures.map((lecture, index, arr) => {
    //     return (
    //         <Fragment>
    //             <button id={(lecture?.watchedBy?.includes(props.user_id)) ? "watched" : null} onClick={e => {
    //                 console.log(e, lecture)
    //                 props.setSelectedLecture(lecture)
    //             }}>{lecture.name} <AiFillPlayCircle /></button>
    //             {/* {index === arr.length - 1 ? (props.currentCourse?.teachers.includes(currentUser.currentUserData._id) ? <div><h1>Teacher si</h1><form onChange={e => handleChange(e)} onSubmit={e => handleSubmit(e)}><input name="name" placeholder="Lecture Name"></input><button>Add</button></form></div> : "") : ""} */}
    //         </Fragment>
    //     )
    // })
    const checkValue = (lectures, id) => {
        for (var i = 0; i < lectures.length; i = i + 1) {
            if (lectures[i].id === id) return true;
        }
        return false;
    }
    useEffect(() => {
        console.log(props.topics[0]?.lectures[0]?.id)
        props.setSelectedLecture(props.topics[0]?.lectures[0]?.id)
    }, [])
    const topicCompleted = (lectures) => {
        let watched = true
        lectures.map(lect => {
            const cLect = props.lectures.find(lectt => lectt._id === lect)
            if (cLect?.watchedBy?.includes(props.user_id)) watched = true
            else watched = false
        })
        return watched
    }
    let display = []
    let first = true
    props.topics.map((topic, tidx) => {
        first = true
        console.log("st", topic)
        props.lectures.map((lecture, idx) => {
            {
                first = true
                if (checkValue(topic.lectures, lecture._id)) {
                    console.log("Uslov")
                    display.push((<Fragment>
                        {first === true ? <h1>{topic.name}</h1> : ""}
                        <button id={(lecture?.watchedBy?.includes(props.user_id)) ? "watched" : null} onClick={e => {
                            console.log(idx, props.topics)
                            if (tidx !== 0) {
                                console.log("ne e 0")
                                if (topicCompleted(props.topics[tidx - 1]?.lectures)) props.setSelectedLecture(lecture)
                                else alert("You haven't completed the previous topic!")
                            }
                            else {
                                console.log("0 e")
                                props.setSelectedLecture(lecture)
                            }
                        }}>{lecture.name} <AiFillPlayCircle /></button>
                        
                    </Fragment>))
                }
                if (checkValue(topic.lectures, lecture._id)) first = false
            }
        })
    })
    return (
        <div className="video-browser">
            {display}
        </div>
    )
}


export default VideoBrowser
