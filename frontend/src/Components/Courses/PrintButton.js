import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "path"
import 'jspdf-autotable'
import logo from "./static/worx.jpg"

const path = require('path');
const pxToMm = (px) => {
    return Math.floor(px / document.getElementById('myMm').offsetHeight);
};
function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.

    var dataURL = canvas.toDataURL("image/png");
    console.log(dataURL)

    return dataURL;
}
const mmToPx = (mm) => {
    return document.getElementById('myMm').offsetHeight * mm;
};

const range = (start, end) => {
    return Array(end - start).join(0).split(0).map(function (val, id) { return id + start });
};


const PrintButton = ({ id, label, width, height, table, text, text2 }) => (<div className="tc mb4 mt2">
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
                        format: [height, width]
                    });
                    console.log(height, width)
                    const imgData = canvas.toDataURL('image/png');
                    pdf.setFontSize(50)
                    pdf.text(30, 40, text);
                    pdf.text(30, 70, text2);
                    // pdf.addImage(imgData, 'PNG', 10, 200, width, height);
                    pdf.text(800, 40, "WorxManager")
                    pdf.autoTable({
                        head: [table.columns],
                        body: table.rows,
                        margin: { top: 100 },
                        didDrawPage: function (data) {
                            data.settings.margin.top = 20;
                        }
                    })

                    pdf.save("asd.pdf");



                });

        }}
    >
        {label}
    </div>
</div >);

export default PrintButton;