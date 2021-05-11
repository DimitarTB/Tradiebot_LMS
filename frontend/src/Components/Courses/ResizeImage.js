import React, { useState } from 'react'
import DownloadLink from 'react-download-link';

function ResizeImage() {
    var canvas = document.createElement('canvas')
    canvas.setAttribute("id", "cav");

    var ctx = canvas.getContext('2d')
    
    function resizeImg() {

        var img = new Image();


        img.addEventListener('load', function () {
            var percents = 0
            var width = img.width
            var height = img.height

            if (width > 1000) {
                var width_percent = width / 100
                while (width > 1000) {
                    width = width - width_percent
                    percents++
                }
                var heightPercent = height / 100
                height = height - (heightPercent * percents)
            }
            percents = 0
            if (height > 1000) {
                var heightPercent = height / 100
                while (height > 1000) {
                    height = height - heightPercent
                    percents++
                }
                var width_percent = width / 100
                width = width - (width_percent * percents)
            }
            // ctx.drawImage(img, height, width)
            canvas.height = height
            canvas.width = width
            ctx.drawImage(img, 0, 0, width, height);


            document.body.appendChild(canvas)
        }, false)
        img.src = "./Assets/icons/sl.jpg"

    }
    function download() {
        // var canvas = document.createElement('canvas')
        // canvas.setAttribute("id", "cav");
        // var ctx = canvas.getContext('2d')
        // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // var link = document.createElement('a');
        // link.download = 'filename.png';
        // link.href = document.getElementById('cav').toDataURL()
        // link.click();
        var link = document.createElement('a');
        link.download = 'filename.png';
        link.href = document.getElementById('cav').toDataURL("image/jpeg")
        link.click();
    }
    return (
        <div>
            {/* <img src="https://static.plastfix.com/public/images/job_128_file_1617826648359408.jpg" width={dimensions.width} height={dimensions.height} /> */}
            <button onClick={() => resizeImg()}>Asd</button>
            <button onClick={() => download()}>Download</button>
        </div>
    )
}

export default ResizeImage
