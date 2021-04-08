import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { getAllCourses } from '../../redux/Courses/CoursesActions'
import { fetchAll, getAllCertificates } from '../../redux/Users/UserActions'
import Container from '../Global/Container'

function ValidCertificate() {
    const dispatch = useDispatch()
    const course_id = useParams().course_id
    const user_id = useParams().user_id

    const userSelector = useSelector(state => state.user)
    const certificates = userSelector.allCertificates.filter(cert => (cert.user_id === user_id && cert.course_id === course_id))


    useEffect(() => {
        dispatch(getAllCertificates())
    }, [])


    return (
        <Container details="Certificate Validity" component={
            <div style={{ marginTop: "40px" }}>
                {certificates.length === 0 ?
                    <h1>Invalid certificate code!</h1>
                    : <h2>
                        {"This is an official certificate that belongs to " + certificates[0]?.name + "."}<br />
                        <h4>{"ID: " + certificates[0]?._id}</h4>
                        <h4>{"Course: " + certificates[0].course_name}</h4>
                        <img src={certificates[0]?.data} />
                    </h2>
                }

            </div>
        }>

        </Container>
    )
}

export default ValidCertificate
