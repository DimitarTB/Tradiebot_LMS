import React, { useState } from 'react'
import Container from '../Global/Container'
import QRCode from "react-qr-code"
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useParams } from 'react-router'
import { addCertificate } from '../../redux/Users/UserActions'

function RequestCertificate() {
    const dispatch = useDispatch()
    const course_id = useParams().course_id
    const course = useSelector(state => state.courses.allCourses.find(crs => crs._id === course_id))
    const [data, setData] = useState({
        "name": ""
    })
    const [redirect, setRedirect] = useState(false)
    const currentUser = useSelector(state => state.user)

    function draw() {
        var canvas = document.getElementById("canvas")

        if (canvas.getContext) {
            var layout = canvas.getContext("2d")
            var background = new Image();
            background.setAttribute('crossorigin', 'anonymous');

            background.addEventListener('load', function () {

                layout.drawImage(background, 0, 0)
                layout.font = "20px Arial"
                layout.fillStyle = "black"
                layout.fillText(data.name, 194, 200)


                // QR Code
                const qr = document.getElementById("qr")
                let clonedSvgElement = qr.cloneNode(true);
                let outerHTML = clonedSvgElement.outerHTML,
                    blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' });

                let URL = window.URL || window.webkitURL || window;
                let blobURL = URL.createObjectURL(blob);

                let qrIMG = new Image()
                qrIMG.setAttribute('crossorigin', 'anonymous');
                qrIMG.addEventListener("load", function () {
                    layout.drawImage(qrIMG, 410, 190)
                    dispatch(addCertificate({ "user_id": currentUser.currentUserData._id, "course_id": course_id, "data": canvas.toDataURL(), "name": data.name }))
                    alert("Certificate successfully added to your certificates!")
                    setRedirect(true)
                }, false)
                qrIMG.src = blobURL

            }, false)
            background.src = "https://images.template.net/wp-content/uploads/2015/02/28065819/Certificate-Templates.jpg"
        }
        else alert("Alert")
    }

    return redirect === true ? <Redirect to="/my_certificates" /> : (
        <Container details="Request Certificate" description={'Request a certificate for completing the course "' + course?.name + '"'} component={
            <div id="edit-quiz-container">
                <div className="topic">
                    <form onChange={(e) => {
                        setData({ ...data, name: e.target.value })
                    }} onSubmit={(e) => {
                        e.preventDefault()
                        draw()
                    }}>
                        <h2>Congratulations on finishing the course!</h2>
                        <h3>In order to receive your certificate, enter your full name.</h3>
                        <h4>Please be careful entering your name, because it will be officially written on the certificate.</h4><br />
                        <input name="name" placeholder="Full Name"></input>
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div style={{ display: "none" }}>

                    <div style={{ display: "none" }}>
                        <canvas id="canvas" width="600px" height="340px">
                        </canvas>
                        <QRCode value={"http://localhost:3000/valid_certificate/" + course_id + "/" + currentUser?.currentUserData?._id} id="qr" size="80" />
                    </div>
                </div>
            </div>
        }>
        </Container>
    )
}

export default RequestCertificate
