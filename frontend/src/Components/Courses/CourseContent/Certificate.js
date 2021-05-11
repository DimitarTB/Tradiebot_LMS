import React, { useEffect, useState } from 'react'
import QRCode from "react-qr-code"

function Certificate() {

    const [dataURL, setDataURL] = useState("")
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
                layout.fillText("Bozhidar Kukeski", 194, 200)


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
                    setDataURL(canvas.toDataURL())
                }, false)
                qrIMG.src = blobURL

            }, false)
            background.src = "https://images.template.net/wp-content/uploads/2015/02/28065819/Certificate-Templates.jpg"
        }
        else alert("Alert")
    }

    useEffect(() => {
        draw()
    })

    window.addEventListener("load", draw, true);

    return (
        <div>

            <div style={{ display: "none" }}>
                <canvas id="canvas" width="1000px" height="1000px">
                </canvas>
                <QRCode value="http://www.google.com/" id="qr" size="80" />
            </div>
            <img src={dataURL} />
        </div>
    )
}

export default Certificate
