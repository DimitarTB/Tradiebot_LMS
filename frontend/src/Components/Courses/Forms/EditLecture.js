import { current } from "@reduxjs/toolkit"
import React, { useState, useEffect, Fragment } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, NavLink, Redirect } from "react-router-dom"
import axios from 'axios'
import { API_URL, getFileName } from "../../../redux/constants"

import Form, {
    datePicker,
    file,
    input,
    multipleSelect,
    select
} from '../../../react-former/Form'
import { editCourse } from "../../../redux/Courses/CoursesActions"
import { getOneLecture, updateLecture, uploadFile, deleteFile } from "../../../redux/Lectures/LecturesActions"
import "./Edit.css"
import { TiDelete } from "react-icons/ti";
import Container from "../../Global/Container"


export default props => {
    const dispatch = useDispatch()

    const lecture_id = useParams().id

    const lectures = useSelector(state => state.lectures)
    const currentLecture = lectures.allLectures.find(lecture => lecture._id === lecture_id)
    const lectureCourse = useSelector(state => state.courses?.allCourses.find(c => c?._id === currentLecture?.course_id))
    const currentUser = useSelector(state => state.user)

    const [info, setInfo] = useState({ type: null, message: null })
    const [lecture, setLecture] = useState({
        name: currentLecture?.name,
        files: [],
        video_file: currentLecture?.video_file,
        content: currentLecture?.content
    })
    const [ff, setFulfilled] = useState(false)

    const lectureValidator = {
        name: {
            type: "string",
            isNullable: false,
            minLength: 3,
            maxLength: 64,
        },
        files: {
            type: "object",
            isNullable: true,
            minLength: 0,
            maxLength: 10
        },
        video_file: {
            type: "string",
            isNullable: false
        }
    }

    const validator = (data, tester) => {
        if(data["name"] === null || data["name"] === undefined || data["name"].length < 1) return setInfo({ type: "warning", message: "Please enter a valid value for the Lecture Name field" })
        return true
    }
    useEffect(() => {
        const data = { "id": lecture_id }
        dispatch(getOneLecture(data))
    }, [])
    useEffect(() => {
        if (ff === true) {
            if (lecture.files.length > 0) {
                if (lectures.filesStatus === "fulfilled") setInfo({ type: "success", message: "Lecture updated successfully!!" })
                else if (lectures.filesStatus === "rejected") setInfo({ type: "error", message: lectures.updateError })
                else setInfo({ type: "loading", message: "Request is being processed. Please wait." })
            }
            else {
                if (lectures.updateStatus === "fulfilled") setInfo({ type: "success", message: "Lecture updated successfully!!" })
                else if (lectures.updateStatus === "rejected") setInfo({ type: "error", message: lectures.updateError })
                else setInfo({ type: "loading", message: "Request is being processed. Please wait." })
            }
        }
    }, [lectures.updateStatus, lectures.filesStatus])
    return (lectureCourse?.teachers?.includes(currentUser?.currentUserData?._id) || currentUser?.currentUserData?.types?.includes("SuperAdmin")) ? (
        <Container details="Edit Lecture" component={
            <div id="edit-quiz-container">
                <Form
                    name={currentLecture?.name}
                    info={info}
                    buttonText="Proceed"
                    data={lecture}
                    handleChange={e => {
                        setFulfilled(false)
                        setInfo({ type: null, message: null })
                        setLecture({
                            ...lecture,
                            [e.target.name]: e.target.value
                        })
                    }}
                    handleSubmit={e => {
                        e.preventDefault()
                        if (validator(lecture, lectureValidator) !== true) return
                        const data = {
                            name: lecture.name,
                            files: currentLecture?.files ? currentLecture.files : [],
                            video_file: lecture.video_file,
                            dateCreated: currentLecture.dateCreated,
                            course_id: currentLecture.course_id,
                            id: lecture_id,
                            watchedBy: currentLecture.watchedBy,
                            content: lecture.content
                        }
                        if (lecture.files.length > 0) data.file = true
                        dispatch(updateLecture(data))

                        if (lecture.files.length > 0) {
                            const data = {
                                lecture: lecture,
                                lecture_id: lecture_id
                            }
                            dispatch(uploadFile(data))
                        }
                        setFulfilled(true)
                    }}
                    fields={[
                        {
                            name: "name",
                            label: "Lecture Name",
                            placeholder: "Please Enter Lecture Name",
                            type: "text",
                            fieldType: input
                        },
                        {
                            name: "files",
                            label: "Select Files",
                            fieldType: file,
                            multiple: true
                        },
                        {
                            name: "video_file",
                            label: "Video for the lecture",
                            type: "text",
                            fieldType: input,
                        },
                        {
                            name: "content",
                            label: "Lecture content",
                            type: "textarea",
                            fieldType: input
                        }
                    ]}
                    overloadedFields={[
                        (
                            <div className="files">
                                <h3 id="title-files">Files:</h3>
                                {currentLecture?.files?.map(fl =>
                                    <Fragment>
                                        <h4>{getFileName(fl)}</h4>
                                        <div className="icon">
                                            <TiDelete style={{ color: "red" }} onClick={() => dispatch(deleteFile({ "id": currentLecture?._id, "file": fl }))} />
                                        </div>
                                    </Fragment>
                                )}
                            </div>
                        )
                    ]}
                />
            </div>
        } />
    ) : <Redirect to="/" />
}