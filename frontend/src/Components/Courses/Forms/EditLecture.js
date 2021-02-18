import { current } from "@reduxjs/toolkit"
import React, { useState, useEffect, Fragment } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, NavLink } from "react-router-dom"
import axios from 'axios'
import { API_URL } from "../../../redux/constants"

import Form, {
    datePicker,
    file,
    input,
    multipleSelect,
    select
} from '../../../react-former/Form'
import { editCourse } from "../../../redux/Courses/CoursesActions"
import { updateLecture } from "../../../redux/Lectures/LecturesActions"


export default props => {

    var getFileName = function (url) {
        return url.split('\\').pop().split('/').pop();
    }
    const dispatch = useDispatch()

    const lecture_id = useParams().id

    const currentLecture = useSelector(state => state.lectures.allLectures.find(lecture => lecture._id === lecture_id))

    const [info, setInfo] = useState({ type: null, message: null })
    const [lecture, setLecture] = useState({
        name: currentLecture.name,
        files: [],
        video_file: currentLecture.video_file
    })

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
        videoFile: {
            type: "string",
            isNullable: false
        }
    }

    const validator = (data, tester) => {
        for (const field in data) {
            if (typeof data[field] !== tester[field]?.type) return setInfo({ type: "warning", message: "Please enter a valid value for the " + field + " field" })
            if (data[field] === null && tester[field].isNullable === false) return setInfo({ type: "warning", message: "Field " + field + " is can't be null" })
            if (data[field].length < tester[field].minLength) return setInfo({ type: "warning", message: "Field " + field + " must be longer" })
            if (data[field].length > tester[field].maxLength) return setInfo({ type: "warning", message: "Field " + field + " must be shorter" })
        }

        return true
    }

    useEffect(() => {
        if (info.type === "loading") {
            // dispatch
        }
    }, [info.type])

    return (
        <Fragment><Form
            name="Edit Lecture"
            info={info}
            buttonText="Proceed"
            data={lecture}
            handleChange={e => {
                setInfo({ type: null, message: null })
                setLecture({
                    ...lecture,
                    [e.target.name]: e.target.value
                })
            }}
            handleSubmit={e => {
                e.preventDefault()
                // if (validator(lecture, lectureValidator) !== true) return
                setInfo({ type: "loading", message: "Request is being processed. Please wait." })

                console.log(lecture.name)
                const data = {
                    name: lecture.name,
                    files: [...currentLecture.files, lecture.files],
                    video_file: lecture.video_file,
                    dateCreated: currentLecture.dateCreated,
                    course_id: currentLecture.course_id,
                    id: lecture_id
                }
                dispatch(updateLecture(data))


                var formData = new FormData();
                for (let i = 0; i < lecture.files.length; i++) {
                    formData.append("file", lecture.files[i]);
                }
                axios.post((API_URL + ("api/upload_file?lecture_id=" + lecture_id)), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
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
                    fieldType: file,
                }
            ]}
        />
        </Fragment>
    )
}