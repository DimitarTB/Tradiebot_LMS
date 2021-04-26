import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getAllCertificates } from '../../redux/Users/UserActions'
import Container from '../Global/Container'
import { jsPDF } from "jspdf";
import { lighten } from '@material-ui/core';
import { Fragment } from 'react';

function Certificates() {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user)
    const courses = useSelector(state => state.courses.allCourses)
    const userCertificates = useSelector(state => state.user?.allCertificates?.filter(cert => cert?.user_id === currentUser?.currentUserData?._id))
    useEffect(() => {
        dispatch(getAllCertificates())
    }, [])
    return (
        <Container details="My Certificates" description="Certificates you have earned by completing courses." component={
            <Fragment>
                {userCertificates.map(cert => <div className="course-card" style={{ height: "30%" }}>
                    <img src={cert.data} style={{ width: "90%", marginLeft: "auto", marginRight: "auto" }} /><br />
                    <h3 style={{ marginLeft: "auto", marginRight: "auto" }}>{"Course: " + cert.course_name}</h3>
                    <button id="enroll" style={{ padding: "6px"}} onClick={(e) => {
                        e.preventDefault()
                        var imgData = cert.data
                        var doc = new jsPDF({
                            orientation: "landscape",
                            format: [300, 640]
                        })
                        doc.addImage(imgData, 'JPEG', 0, 0, 640, 300)
                        doc.save(cert.name)
                    }}>Export PDF</button></div>
                )}
            </Fragment>
        }></Container>
    )
}
export default Certificates
