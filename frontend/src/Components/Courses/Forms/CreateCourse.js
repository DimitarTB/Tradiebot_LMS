import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"

import Form, {
    datePicker,
    file,
    input,
    multipleSelect,
    select
} from '../../../react-former/Form'
import { createCourse } from "../../../redux/Courses/CoursesActions"



export default props => {

    const dispatch = useDispatch()

    const courseState = useSelector(state => state.courses)
    const teachers = useSelector(state => state.user.allUsers.filter(user => user.types.includes("Teacher")))
    const currentUser = useSelector(state => state.user)
    const [info, setInfo] = useState({ type: null, message: null })
    const [ff, setFF] = useState(false)
    const [course, setCourse] = useState({
        name: null,
        description: null,
        teachers: [],
        manualEnroll: null
    })

    const courseValidator = {
        name: {
            type: "string",
            isNullable: false,
            minLength: 3,
            maxLength: 64,
        },
        description: {
            type: "string",
            isNullable: false,
            minLength: 6,
            maxLength: 256
        },
        teachers: {
            type: "object",
            isNullable: true,
            minLength: 0,
            maxLength: 4
        },
        courseType: {
            type: "string",
            isNullable: false
        }
    }


    useEffect(() => {
        if (ff === true) {
            if (courseState.loadingStatus === "fulfilled") {
                setInfo({ type: "success", message: "Course successfully created!" })
                setFF(false)
            }
        }
    }, [courseState.loadingStatus])
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
            const data = {
                name: course.name,
                description: course.description,
                teachers: course.teachers,
                manualEnroll: (course.courseType === "Manual Enroll" ? true : false),
                username: currentUser.currentUserData.username
            }
            dispatch(createCourse(data))
            setFF(true)
        }
        // if (info.type === "error") {

        // }
    }, [info.type])

    return (
        <Form
            name="Create Course"
            info={info}
            buttonText="Proceed"
            data={course}
            handleChange={e => {
                setInfo({ type: null, message: null })
                setCourse({ ...course, [e.target.name]: e.target.value })
            }}
            handleSubmit={e => {
                e.preventDefault()
                // if (validator(course, courseValidator) !== true) return
                setInfo({ type: "loading", message: "Request is being processed. Please wait." })
            }}
            fields={[
                {
                    name: "name",
                    label: "Course Name",
                    placeholder: "Please Enter Course Name",
                    type: "text",
                    fieldType: input
                },
                {
                    name: "description",
                    label: "Course Description",
                    placeholder: "Please Enter Course Description",
                    type: "textarea",
                    fieldType: input
                },
                {
                    name: "teachers",
                    label: "Select Teachers",
                    placeholder: "Please Select Teachers for this course",
                    fieldType: multipleSelect,
                    options: teachers,
                    displayField: "username",
                    valueField: "_id"
                },
                {
                    name: "courseType",
                    label: "Select Course Type",
                    placeholder: "Please Select Teachers for this course",
                    fieldType: select,
                    options: [{ name: "Manual Enroll" }, { name: "Self Enroll" }],
                    displayField: "name",
                    valueField: "name"
                }
            ]}
        // overloadedFields={[
        //     (
        //         <div>
        //             <h1>Over</h1>
        //         </div>
        //     )
        // ]}
        />
    )
}