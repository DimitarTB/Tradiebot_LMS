import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "path"
import 'jspdf-autotable'

const path = require('path');

const pxToMm = (px) => {
    return Math.floor(px / document.getElementById('myMm').offsetHeight);
};

const mmToPx = (mm) => {
    return document.getElementById('myMm').offsetHeight * mm;
};

const range = (start, end) => {
    return Array(end - start).join(0).split(0).map(function (val, id) { return id + start });
};


function getDataUri(url, callback) {
    var image = new Image();
    image.setAttribute('crossorigin', 'anonymous')
    console.log("Funct")
    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = "400"; // or 'width' if you want a special/scaled size
        canvas.height = "100"; // or 'height' if you want a special/scaled size
        console.log("Funct2")
        canvas.getContext('2d').drawImage(this, 0, 0);

        // Get raw image data

        // ... or get as Data URI
        callback(canvas.toDataURL('image/jpg'));
    };
    image.src = url;
}

const PrintButton = ({ id, label, width, height, table }) => (<div className="tc mb4 mt2">
    {/*
    Getting pixel height in milimeters:
    https://stackoverflow.com/questions/7650413/pixel-to-mm-equation/27111621#27111621
  */}
    <div id="myMm" style={{ height: "1mm" }} />


    <div
        className="pa2 ba bw1 b--black bg-yellow black-90 br2 dib pointer dim shadow-1"
        onClick={() => {
            const input = document.getElementById(id);
            const inputHeightMm = pxToMm(input.offsetHeight);
            const a4WidthMm = 210;
            const a4HeightMm = 297;
            const a4HeightPx = mmToPx(a4HeightMm);
            const numPages = inputHeightMm <= a4HeightMm ? 1 : Math.floor(inputHeightMm / a4HeightMm) + 1;
            console.log({
                input, inputHeightMm, a4HeightMm, a4HeightPx, numPages, range: range(0, numPages),
                comp: inputHeightMm <= a4HeightMm, inputHeightPx: input.offsetHeight
            });


            html2canvas(input, { scrollX: -window.scrollX, scrollY: -window.scrollY })
                .then((canvas) => {
                    const pdf = new jsPDF({
                        orientation: "landscape",
                        unit: "px",
                        format: [2000, width]
                    });
                    const imgData = canvas.toDataURL('image/png');
                    pdf.setFontSize(50)
                    pdf.text(10, 55, 'Text');
                    pdf.text(10, 105, 'Text2');
                    // pdf.addImage(imgData, 'PNG', 10, 200, width, height);
                    pdf.autoTable({
                        head: [table.columns],
                        body: table.rows,
                    })

                    getDataUri("https://images.template.net/wp-content/uploads/2015/02/28065819/Certificate-Templates.jpg", function (dataUri) {
                        console.log("ins")
                        pdf.addImage(dataUri, 'JPG', 200, 10)
                        pdf.save("asd.pdf");
                    })
                });
            // html2canvas()

        }}
    >
        {label}
    </div>
</div >);

export default PrintButton;