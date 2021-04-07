import React, { useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { createComment, deleteComment, getAllComments } from '../../../redux/Comments/CommentsActions'
import { fetchAll } from "../../../redux/Users/UserActions"
import { useParams, NavLink, BrowserRouter, Link } from "react-router-dom"
import "./comments.css"
import { API_URL, getFileName, FILES_URL } from "../../../redux/constants"
import axios from 'axios'
import DownloadLink from "react-download-link"
import FileSaver from 'file-saver';
import { MdInsertDriveFile } from 'react-icons/md'
import { FcCancel, FcVideoFile } from "react-icons/fc";
import { BsCardImage } from "react-icons/bs"
import { ImFileVideo } from "react-icons/im"
import { FaFileAlt } from "react-icons/fa"
import { FaRegFilePdf } from "react-icons/fa"
import { getQuizRecords } from '../../../redux/Quizzes/QuizzesActions'


const CourseInfoSection = props => {

    const [selectedTab, setSelectedTab] = useState(2)
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

    const handleSubmit = (e, replyTo = "") => {
        e.preventDefault();


        const data = {
            "token": allUsers.currentUser,
            "creator_id": allUsers.currentUserData._id,
            "lecture_id": props.lecture?._id,
            "comment": comment,
            "replyTo": replyTo
        }

        dispatch(createComment(data))

    }

    useEffect(() => {
        console.log("fetch all")
        dispatch(getAllComments(allUsers.currentUser))
    }, [])
    function filterComments(comment) {
        return (comment.lecture_id === props.lecture?._id)
    }


    const fileType = (file) => {
        if (file.includes("pdf")) return (<FaRegFilePdf />)
        if (file.includes("jpg") || file.includes("png") || file.includes("gif") || file.includes("jpeg")) return (<BsCardImage />)
        return (<FaFileAlt />)
    }

    const displayComments = selectComments?.filter(filterComments)
    const tabs = [
        (
            <div className="course-details">
                <h2>{props.lecture.video_file !== "" ? props.lecture?.name : null}</h2>
                <p>{props.lecture.video_file !== "" ? props.lecture?.content : null}</p>
            </div>
        ),
        (
            <div className="course-comments">
                {displayComments.map(comment => comment.replyTo === "" ? <div id="comment">
                    {comment.comment}
                    {allUsers.allUsers?.map(user => {
                        if (user?._id === comment?.creator_id) {
                            if (props.course.teachers.includes(allUsers.currentUserData._id)) {
                                return (
                                    <Fragment>
                                        {comment.creator_id === allUsers.currentUserData._id ? <FcCancel onClick={() => dispatch(deleteComment({ "id": comment._id }))} /> : null}
                                        <h6>{user?.username}</h6>
                                        {selectComments.map(comm => comm.replyTo === comment._id ? <div id="comment">{comm.comment}{comm.creator_id === allUsers.currentUserData._id ? <FcCancel onClick={() => dispatch(deleteComment({ "id": comm._id }))} /> : null}<h6>{allUsers.allUsers.find(usr => usr._id === comm.creator_id).username}</h6></div> : null)}
                                        <form onChange={e => handleChange(e)} onSubmit={e => handleSubmit(e, comment._id)}>
                                            <input id="comment" name="comment" placeholder="Reply..."></input><button>Post</button>
                                        </form>
                                    </Fragment>
                                )
                            }
                            return (<Fragment>
                                <FcCancel onClick={() => dispatch(deleteComment({ "id": comment._id }))} />
                                <h6>{user?.username}</h6>
                                {selectComments.map(comm => comm.replyTo === comment._id ? <div id="comment">{comm.comment}<h6>{allUsers.allUsers.find(usr => usr._id === comm.creator_id).username}</h6></div> : null)}
                            </Fragment>)
                        }
                    })}
                </div> : null)}
                <form onChange={e => handleChange(e)} onSubmit={e => handleSubmit(e)}>
                    <input id="comment" name="comment" placeholder="Message..."></input><button>Post</button>
                </form>
            </div>
        ),
        (
            <div className="course-files">
                {props.lecture.video_file !== "" ? <Fragment><ImFileVideo /><h2 style={{ cursor: "pointer", display: "inline" }} onClick={() => props.setShowVideo(true)}> Lecture Video</h2></Fragment> : null}<br />
                {props.lecture?.files?.map(file => <Fragment style={{ display: "inline" }}>{<div style={{ display: "inline" }}>{fileType(getFileName(file))}</div>}<h2 style={{ display: "inline" }}><a href={FILES_URL + file} target="_blank" download>{" " + getFileName(file)}</a></h2><br /></Fragment>)}
            </div >
        )
    ]

    return (
        <div className="course-info">
            <div className="info-nav">
                <h3 onClick={e => setSelectedTab(2)}>Resources</h3>
                <h3 onClick={e => setSelectedTab(1)}>Comments</h3>
            </div>
            <div className="tab">
                {tabs[selectedTab]}
            </div>
        </div>
    )
}


export default CourseInfoSection