import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getAllCertificates } from '../../redux/Users/UserActions'
import Container from '../Global/Container'
import { jsPDF } from "jspdf";
import { lighten } from '@material-ui/core';

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
            <ul>
                {userCertificates.map(cert => <li style={{ padding: "10px", color: "black", cursor: "pointer", margin: "20px", width: "10%", background: "rgba(0, 0, 0, 0.1" }} onClick={() => {
                    var imgData = cert.data
                    var doc = new jsPDF({
                        orientation: "landscape",
                        format: [100, 180]
                    })
                    doc.addImage(imgData, 'JPEG', 0, 0, 300, 300)
                    doc.save(cert.name)
                }}>{cert.course_name}</li>
                )}
            </ul>
        }></Container>
    )
}
export default Certificates
