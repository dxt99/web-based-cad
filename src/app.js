/*
    HTML Elements
*/
const canvas = document.getElementById("canvas")
const colorPicker = document.getElementById("colorPicker")
const cursorButton = document.getElementById("cursor")
const lineButton = document.getElementById("line")
const squareButton = document.getElementById("square")
const rectangleButton = document.getElementById("rectangle")
const clearButton = document.getElementById("clear")
const prompt = document.getElementById("prompt")

/*
    WebGL Setup
*/
const gl = WebGLUtils.setupWebGL(canvas);
const rect = canvas.getBoundingClientRect()

var vs = `attribute vec2 pos;
        varying vec4 fColor;
        attribute vec4 vColor;
		void main() { 
            gl_Position = vec4(pos, 0, 1); 
            fColor = vColor;
        }`
var fs = `precision mediump float; 
        varying vec4 fColor;
        void main() { 
            gl_FragColor = fColor; 
        }`
var program = createProgram(vs,fs);
// Tell WebGL how to convert from clip space to pixels
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas
gl.clearColor(0, 0, 0, 0);

gl.useProgram(program);

/*
    States
    mode -> current mode of operation: cursor/line/square/rectangle
    pendingLine ->  line to be drawn, used on line mode
    models -> all models that are going to be rendered
*/
let mode = "cursor";
let pendingLine = new Line()
let pendingRectangle = new Rectangle()
let models = {
    "lines" : [],
    "squares": [],
    "rectangles": []
}
let curColor = [0, 0, 0, 1.0]

/* 
    Rendering
    render() -> renders all models using its method
*/
function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);

    models['lines'].forEach(line => {
        line.render(gl, program)
    })
    models['rectangles'].forEach(rect => {
        rect.render(gl, program)
    })
}
/* 
    Listener logic
*/

function clearStates(){
    // clears all pending states
    pendingLine = new Line()

}

function changeState(newMode){
    // changes mode of operations
    console.log(newMode)
    pendingLine = new Line()
    mode = newMode
    if (mode=="cursor") prompt.innerHTML = "Cursor mode"
    if (mode=="line") prompt.innerHTML = "Select line start"
    if (mode=="rectangle") prompt.innerHTML = "Select rectangle upper left corner"
}


function resetModels(){
    // deletes all models
    clearStates()
    models = {
        "lines" : [],
        "squares": [],
        "rectangles": []
    }
    render()
}

function changeColor(){
    // changes current color
    let color = colorPicker.value
    let red = parseInt(color.slice(1, 3), 16)
    let green = parseInt(color.slice(3, 5), 16)
    let blue = parseInt(color.slice(5, 7), 16)
    curColor = [red/255.0, green/255.0, blue/255.0, 1.0]
    console.log("Color")
    console.log(red)
    console.log(curColor)
}


function handleLineClick(x, y){
    if (pendingLine.start === null){
        // add start of line
        pendingLine.start = [x, y]
        pendingLine.startColor = curColor
        prompt.innerHTML = "Select line end"
    }
    else if (pendingLine.end === null){
        // add end of line
        pendingLine.end = [x, y]
        pendingLine.endColor = curColor
        models['lines'].push(pendingLine)
        pendingLine = new Line()
        render()
        prompt.innerHTML = "Select line start"
    }
}

function handleRectangleClick(x, y){
    if (pendingRectangle.start === null){
        // add start of rectangle
        pendingRectangle.start = [x, y]
        pendingRectangle.startColor = curColor
        prompt.innerHTML = "Select rectangle lower right corner"
    }
    else if (pendingRectangle.end === null){
        // add end of line
        if (pendingRectangle.start[0] < x){
            pendingRectangle.end = pendingRectangle.start
            pendingRectangle.endColor = pendingRectangle.startColor
            pendingRectangle.startColor = curColor
            pendingRectangle.start = [x, y]
        }
        else {
            pendingRectangle.end = [x, y]
            pendingRectangle.endColor = curColor
        }
        models['rectangles'].push(pendingRectangle)
        pendingRectangle = new Rectangle()
        render()
        prompt.innerHTML = "Select rectangle upper left corner"
    }
}

function handleClick(canvas, event){
    // handles clicks on canvas
    let x = (event.clientX - rect.left) * canvas.width/canvas.clientWidth
    let y = (event.clientY - rect.top) * canvas.height/canvas.clientHeight
    x = to_float_x(x, gl.canvas.width)
    y = to_float_y(y, gl.canvas.height)
    console.log(x)
    console.log(y)
    // checks for current mode
    if (mode=="line")handleLineClick(x, y)
    if (mode=="rectangle")handleRectangleClick(x, y)
}

/*
    Listeners
*/
cursorButton.addEventListener("click", () => {changeState("cursor")})
lineButton.addEventListener("click", () => {changeState("line")})
squareButton.addEventListener("click", () => {changeState("square")})
rectangleButton.addEventListener("click", () => {changeState("rectangle")})
clearButton.addEventListener("click", () => {resetModels()})

canvas.addEventListener('mousedown', function(e) {
    handleClick(canvas, e)
})
colorPicker.addEventListener("change", () => {changeColor()})

