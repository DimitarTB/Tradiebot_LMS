import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { createComment, getAllComments } from '../../../redux/Comments/CommentsActions'
import { fetchAll } from "../../../redux/Users/UserActions"
import { useParams } from "react-router-dom"
import "./comments.css"

const CourseInfoSection = props => {

    const [selectedTab, setSelectedTab] = useState(0)
    const dispatch = useDispatch()
    var selectComments = useSelector(state => state.comments.allComments)
    const allUsers = useSelector(state => state.user)

    const [comment, setComment] = useState({
        comment: ""
    })

    const handleChange = e => {
        setComment({
            ...comment,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault();


        const data = {
            "token": allUsers.currentUser,
            "creator_id": allUsers.currentUserData._id,
            "lecture_id": props.lecture._id,
            "comment": comment,
            "replyTo": ""
        }

        dispatch(createComment(data))

    }

    useEffect(() => {
        dispatch(getAllComments(allUsers.currentUser))
        dispatch(fetchAll(allUsers.currentUser))
    }, [])

    function filterComments(comment) {
        return (comment.lecture_id === props.lecture?._id)
    }
    const displayComments = selectComments.filter(filterComments)
    const tabs = [
        (
            <div className="course-details">
                <h2>{props.course?.name}</h2>
                <p>{props.course?.description}</p>
                <p>{props.course?.dateCreated}</p>
            </div>
        ),
        (
            <div className="course-comments">
                {displayComments.map(comment => <div id="comment">
                    {comment.comment}
                    {allUsers.allUsers?.map(user => {
                        if (user?._id === comment?.creator_id) return <h6>{user?.username}</h6>
                    })}
                </div>)}
                <form onChange={e => handleChange(e)} onSubmit={e => handleSubmit(e)}>
                    <input id="comment" name="comment" placeholder="Message..."></input><button>Post</button>
                </form>
            </div>
        ),
        (
            <div className="course-files">
                Lecture Files
                {props.lecture?.files?.map(file => <a href={file.file_path} download>{file.name}</a>)}
            </div>
        )
    ]

    return (
        <div className="course-info">
            <div className="info-nav">
                <h3 onClick={e => setSelectedTab(0)}>Details</h3>
                <h3 onClick={e => setSelectedTab(1)}>Comments</h3>
                <h3 onClick={e => setSelectedTab(2)}>Files</h3>
            </div>
            <div className="tab">
                {tabs[selectedTab]}
            </div>
        </div>
    )
}


export default CourseInfoSection