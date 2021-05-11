import React, { Fragment, useEffect, useRef, useState } from 'react'
import { CirclePicker } from 'react-color'
export const CanvasPaint = React.memo(props => {

    const myRef = useRef("draw")
    const [hover, setHover] = useState(false);

    var history = useRef({
        redo_list: [],
        undo_list: [],
        saveState: function (canvas, list, keep_redo) {
            keep_redo = keep_redo || false;
            if (!keep_redo) {
                this.redo_list = [];
            }

            (list || this.undo_list).push(canvas.toDataURL());
        },
        undo: function (canvas, ctx) {
            this.restoreState(canvas, ctx, this.undo_list, this.redo_list);
        },
        redo: function (canvas, ctx) {
            this.restoreState(canvas, ctx, this.redo_list, this.undo_list);
        },
        restoreState: function (canvas, ctx, pop, push) {
            if (pop.length) {
                this.saveState(canvas, push, true);
                var restore_state = pop.pop();
                var img = new Image()
                img.src = restore_state
                img.onload = function () {
                    var percents = 0

                    var width = img.width
                    var height = img.height

                    if (width > 500) {
                        var width_percent = width / 100
                        while (width > 500) {
                            width = width - width_percent
                            percents++
                        }
                        var heightPercent = height / 100
                        height = height - (heightPercent * percents)
                    }
                    percents = 0
                    if (height > 500) {
                        var heightPercent = height / 100
                        while (height > 500) {
                            height = height - heightPercent
                            percents++
                        }
                        var width_percent = width / 100
                        width = width - (width_percent * percents)
                    }

                    canvas.height = height
                    canvas.width = width
                    ctx.drawImage(img, 0, 0, width, height);

                }
            }
        }
    })



    useEffect(() => {

        // perform a one-time drawing on the canvas element that should be retained throughout state changes

        myRef.current.addEventListener('onmouseover', () => setHover(true));
        myRef.current.addEventListener('onmouseout', () => setHover(false));

    }, [])


    let drawing = false;
    let pathsry = [];
    let points = [];

    const [canCopy, setCan] = useState(null)

    if (canCopy === null) {
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            font = '14px sans-serif',
            hasInput = false;
        canvas.setAttribute("id", "cav");
    }
    else {
        var canvas = document.createElement('canvas'),
            ctx = canCopy,
            font = '14px sans-serif',
            hasInput = false;
        canvas.setAttribute("id", "cav");
    }

    const handleChangeComplete = (color) => {
        ctx.strokeStyle = color.hex
        ctx.fillStyle = color.hex
    };
    var download = function () {
        var link = document.createElement('a');
        link.download = 'filename.png';
        link.href = document.getElementById('cav').toDataURL()
        link.click();
    }

    var clearCanvas = function () {
        const context = canvas.getContext('2d');
        var background = new Image();
        // background.setAttribute('crossorigin', 'anonymous');

        background.addEventListener('load', function () {
            context.clearRect(0, 0, canvas.width, canvas.height);

            var percents = 0

            var width = background.width
            var height = background.height

            if (width > 500) {
                var width_percent = width / 100
                while (width > 500) {
                    width = width - width_percent
                    percents++
                }
                var heightPercent = height / 100
                height = height - (heightPercent * percents)
            }
            percents = 0
            if (height > 500) {
                var heightPercent = height / 100
                while (height > 500) {
                    height = height - heightPercent
                    percents++
                }
                var width_percent = width / 100
                width = width - (width_percent * percents)
            }

            canvas.height = height
            canvas.width = width
            ctx.drawImage(background, 0, 0, width, height);
        }, false)
        background.src = "./Assets/icons/sl.jpg"
        // resize();
    }

    // if(document.getElementById('cnv')) document.getElementById('cnv').innerHTML = ""

    // document.getElementById('cnv')?.appendChild(canvas)
    // Drawing

    // if (document.getElementById("cav") === null) document.body.appendChild(canvas)
    // else document.body.replaceChild(canvas, document.getElementById("cav"));

    // if (document.getElementById("cnv_ref")) document.getElementById("cnv_ref").appendChild(canvas)
    // else document.body.replaceChild(canvas, document.getElementById("cav"));






    // UNDO

    function drawPaths() {
        // delete everything
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // draw all the paths in the paths array
        pathsry.forEach(path => {
            ctx.beginPath();
            ctx.moveTo(path[0].x, path[0].y);
            for (let i = 1; i < path.length; i++) {
                ctx.lineTo(path[i].x, path[i].y);
            }
            ctx.stroke();
        })
    }

    function Undo() {
        // remove the last path from the paths array
        pathsry.splice(-1, 1);
        // draw all the paths in the paths array
        drawPaths();
    }

    function oMousePos(canvas, evt) {
        var ClientRect = canvas.getBoundingClientRect();
        return { //objeto
            x: Math.round(evt.clientX - ClientRect.left),
            y: Math.round(evt.clientY - ClientRect.top)
        }
    }

    canvas.addEventListener('mousedown', function (e) {
        drawing = true;
    });

    canvas.addEventListener('touchstart', function (e) {
        drawing = true;
    });

    canvas.addEventListener('mouseup', function () {
        drawing = false;
        // Adding the path to the array or the paths
        pathsry.push(points);
    }, false);

    canvas.addEventListener('touchend', function () {
        drawing = false;
        // Adding the path to the array or the paths
        pathsry.push(points);
    }, false);








    // some hotfixes... ( ≖_≖)
    document.body.style.margin = 0;
    // canvas.style.position = 'fixed';
    // canvas.style.width = 500
    // canvas.style.height = 500

    // get canvas 2D context and set him correct size
    var ctx = canvas.getContext('2d');

    var background = new Image();
    // background.setAttribute('crossorigin', 'anonymous');

    background.addEventListener('load', function () {
        var percents = 0

        var width = background.width
        var height = background.height

        if (width > 500) {
            var width_percent = width / 100
            while (width > 500) {
                width = width - width_percent
                percents++
            }
            var heightPercent = height / 100
            height = height - (heightPercent * percents)
        }
        percents = 0
        if (height > 500) {
            var heightPercent = height / 100
            while (height > 500) {
                height = height - heightPercent
                percents++
            }
            var width_percent = width / 100
            width = width - (width_percent * percents)
        }

        canvas.height = height
        canvas.width = width
        ctx.drawImage(background, 0, 0, width, height);
    }, false)
    background.src = "./Assets/icons/sl.jpg"
    // resize();

    // last known position
    var pos = { x: 0, y: 0 };

    // window.addEventListener('resize', resize);
    document.addEventListener('mousemove', draw);
    document.addEventListener('touchmove', draw);
    document.addEventListener('mousedown', setPosition);
    document.addEventListener('touchstart', setPosition);
    document.addEventListener('mouseenter', setPosition);
    document.addEventListener('touchend', setPosition);

    function canvasCopy() {
        var ctx = canvas.getContext('2d');
        setCan(ctx);
    }

    // new position from mouse event
    function setPosition(e) {
        pos.x = e.clientX;
        pos.y = e.clientY;
    }

    // resize canvas
    // function resize() {
    //     ctx.canvas.width = 500;
    //     ctx.canvas.height = 500;
    // }


    canvas.addEventListener('mousedown', function () {
        history.current.saveState(canvas)
        // ctx.strokeStyle = color
    });
    canvas.addEventListener('touchstart', function () {
        history.current.saveState(canvas)
        // ctx.strokeStyle = color
    });


    function draw(e) {
        // mouse left button must be pressed
        if (e.buttons !== 1) return;
        // console.log(props.tool)
        if (myRef.current === "draw") {
            hasInput = true


            ctx.beginPath(); // begin

            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            // ctx.strokeStyle = color;

            ctx.moveTo((pos.x + window.scrollX), (pos.y - canvas.offsetTop + window.scrollY)); // from
            setPosition(e);
            ctx.lineTo((pos.x + window.scrollX), (pos.y - canvas.offsetTop + window.scrollY)); // to

            ctx.stroke(); // draw it!

            return;
        }
        else if (myRef.current === "text") {
            hasInput = false
            canvas.onclick = function (e) {
                if (hasInput) return;
                addInput(e.clientX, e.clientY);
            }
            function addInput(x, y) {
                var input = document.createElement('input');

                input.type = 'text';
                input.style.position = 'fixed';
                input.style.left = (x + window.scrollX - 10) + 'px';
                input.style.top = (y + window.scrollY - 10) + 'px';
                input.style.background = "transparent"
                input.style.border = "none"
                input.style.outline = "none"

                input.onkeydown = handleEnter;

                document.body.appendChild(input);

                input.focus();

                hasInput = true;
            }
            function handleEnter(e) {
                var keyCode = e.keyCode;
                if (keyCode === 13) {
                    drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
                    document.body.removeChild(this);
                    hasInput = false;
                }
            }
            function drawText(txt, x, y) {
                ctx.textBaseline = 'top';
                ctx.textAlign = 'left';
                ctx.font = font;
                ctx.fillText(txt, x - canvas.offsetLeft + 2, y - canvas.offsetTop + 3);
            }
        }
    }
    return (
        <Fragment>
            <div>
                {/* <form onChange={(e) => setColor(e.target.value)}><input placeholder="color" name="color"></input></form> */}
                <h1 onClick={(e) => {
                    myRef.current = "draw"
                }}>Draw</h1>
                <h1 onClick={(e) => {
                    myRef.current = "text"
                }}>Text</h1>
                <button onClick={() => download()}>Download</button>
                <button onClick={() => clearCanvas()}>Clear</button>
                <button onClick={() => history.current.undo(canvas, ctx)}>Undo</button>
                <button onClick={() => history.current.redo(canvas, ctx)}>Redo</button>
                <button onClick={() => document.getElementById("cnv_ref").appendChild(canvas)}>Canvas</button>
                <CirclePicker
                    onChange={handleChangeComplete}
                />
            </div>
            { hover && <p>Hoverin</p>}
            <div id="cnv_ref" ref={myRef}></div>
        </Fragment >
    )
})

export default CanvasPaint