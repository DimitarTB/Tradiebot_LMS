import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { createComment, getAllComments } from '../../../redux/Comments/CommentsActions'
import { fetchAll } from "../../../redux/Users/UserActions"
import { useParams, NavLink, BrowserRouter, Link } from "react-router-dom"
import "./comments.css"
import { API_URL } from "../../../redux/constants"
import axios from 'axios'
import DownloadLink from "react-download-link"
import FileSaver from 'file-saver';
import { MdInsertDriveFile } from 'react-icons/md'

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
    const sendFile = e => {

        console.log(API_URL + "api/upload_image")
        var formData = new FormData();
        formData.append("image", e[0]);
        axios.post((API_URL + ("api/upload_image?course_id=" + props.course?._id)), formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
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

        console.log(props.lecture._id)
        dispatch(createComment(data))

    }

    useEffect(() => {
        console.log("fetch all")
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
                <form>
                    <input type="file" onChange={(e) => sendFile(e.target.files)} />
                    <button>Submit</button>
                </form>

                {props.lecture?.files?.map(file => <a href={file.file_path} download>{file.name}</a>)}
                <a href="http://localhost:88/lms/public/HelloWOrld.cpp" target="_blank" download>
                    <img src="/images/myw3schoolsimage.jpg" alt="W3Schools" width="104" height="142" />
                </a>
                {/* "http://localhost:88/lms/public/HelloWOrld.txt" */}
            </div >
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