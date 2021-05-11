import React, { useEffect, useState } from 'react'
import { jsPDF } from "jspdf";
import { html2canvas } from "html2canvas"
import PrintButton from './PrintButton';
import Table from '../Table/Table';
import { Fragment } from 'react';
import logo from "./static/worx.jpg"



function PdfComponent() {
    const [dimensions, setDimensions] = useState({
        height: 0,
        width: 0
    })

    const [table, setTable] = useState({
        columns: [],
        rows: []
    })
    function getDataUri(url, callback) {
        var image = new Image();
        image.setAttribute('crossorigin', 'anonymous')
        image.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = "300"; // or 'width' if you want a special/scaled size
            canvas.height = "300"; // or 'height' if you want a special/scaled size
            canvas.getContext('2d').drawImage(this, 0, 0);

            // Get raw image data

            // ... or get as Data URI
            callback(canvas.toDataURL('image/jpg'));
        };
        image.src = url;
    }

    useEffect(() => {
        getDataUri("https://images.template.net/wp-content/uploads/2015/02/28065819/Certificate-Templates.jpg", function (dataUri) {
        })
    }, [])
    var rows = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {},].map((a, index) => [
        { "Name": "name", },
        { "ID": "id", },
        { "Category": "category", },
        { "Serial Number": index, },
    ])


    const columns = [
        { name: "Name" },
        { name: "ID" },
        { name: "Category" },
        { name: "Serial Number" },
        { name: "Name" },
        { name: "ID" },
        { name: "Category" },
        { name: "Serial Number" },
        { name: "Name" },
        { name: "ID" },
        { name: "Category" },
        { name: "Serial Number" },
        { name: "Name" },
        { name: "ID" },
        { name: "Category" },
        { name: "Serial Number" },
        { name: "Name" },
        { name: "ID" },
        { name: "Category" },
        { name: "Serial Number" },

    ]
    useEffect(() => {
        const dimensions = document.getElementById("divIdToPrint").getBoundingClientRect()
        setDimensions({ height: dimensions.height, width: dimensions.width })
        const tableColumns = []
        columns.map(cl => tableColumns.push(cl.name))
        const tableRows = []
        Object.values(rows).map(vl => {
            const arr_p = []
            arr_p.push([vl[0].Name])
            arr_p.push([vl[1].ID])
            arr_p.push([vl[2].Category])
            arr_p.push([vl[3]['Serial Number']])

            tableRows.push(arr_p)
        })



        setTable({ rows: tableRows, columns: tableColumns })

    }, [])
    return (
        <Fragment>
            <div id="divIdToPrint">
                <br />
                <br />
                <br />
                <Table
                    setExportData={() => { }}
                    redirectPath="/asset/"
                    appendField="ID"
                    appendFieldIdx={1}
                    columns={columns}
                    rows={rows}
                />

            </div>
            <PrintButton text="Text" text2="Text2" table={table} width={500} height={1080} id={"divIdToPrint"} label="Export" />
        </Fragment>
    )
}

export default PdfComponent
