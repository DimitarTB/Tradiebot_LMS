import React, { useEffect } from 'react'

function Certificate() {

    function draw() {
        var canvas = document.getElementById("canvas")

        if (canvas.getContext) {
            var layout = canvas.getContext("2d")
            var background = new Image();

            background.src = "https://images.template.net/wp-content/uploads/2015/02/28065819/Certificate-Templates.jpg"
            layout.addEventListener("load", (e) => {
                layout.drawImage(background, 0, 0)
            })

            layout.font = "20px Arial"
            layout.fillStyle = "black"
            layout.fillText("Aleksandar Popof", 195, 200)
        }
        else alert("Alert")
    };

    useEffect(() => {
        draw()
    })

    return (
        <canvas id="canvas" width="500px" height="500px">
        </canvas>
    )
}

export default Certificate
