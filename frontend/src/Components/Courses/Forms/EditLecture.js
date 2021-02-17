import { current } from "@reduxjs/toolkit"
import React, { useState, useEffect, Fragment } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, NavLink } from "react-router-dom"

import Form, {
    datePicker,
    file,
    input,
    multipleSelect,
    select
} from '../../../react-former/Form'
import { editCourse } from "../../../redux/Courses/CoursesActions"


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
        description: currentLecture.description,
        files: currentLecture.files,
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
            // course.dateCreated = currentCourse.dateCreated
            // course._id = course_id
            // course.manualEnroll = course.manualEnroll === "Self Enroll" ? false : true
            // const data = {
            //     course: course,
            //     token: currentUser.currentUser
            // }
            // dispatch(editCourse(data))

            // dispatch
        }
    }, [info.type])

    return (
        <Fragment><Form
            name="Edit Course"
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
                if (validator(lecture, lectureValidator) !== true) return
                else setInfo({ type: "loading", message: "Request is being processed. PLease wait." })
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
                    placeholder: "Please Select Files for this lecture",
                    type: "file",
                    fieldType: input,
                },
                {
                    video_file: "video_file",
                    label: "Video for the lecture",
                    type: "file",
                    fieldType: input
                }
            ]}
        />
        </Fragment>
    )
}