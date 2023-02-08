/*
    HTML Elements
*/
const canvas = document.getElementById("canvas")
const cursorButton = document.getElementById("cursor")
const lineButton = document.getElementById("line")
const squareButton = document.getElementById("square")
const clearButton = document.getElementById("clear")
const prompt = document.getElementById("prompt")

/*
    WebGL Setup
*/
const gl = WebGLUtils.setupWebGL(canvas);
const rect = canvas.getBoundingClientRect()

var vs = 'attribute vec2 pos;' +
				 'void main() { gl_Position = vec4(pos, 0, 1); }';
var fs = 'precision mediump float;' +
            'void main() { gl_FragColor = vec4(0,0,0,1); }';
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
let models = {
    "lines" : [],
    "squares": [],
    "rectangles": []
}

/* 
    Rendering
    render() -> renders all models using its method
*/
function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);

    models['lines'].forEach(line => {
        console.log(line)
        line.render(gl, program)
    });
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
    console.log(mode)
    if (mode=="cursor") prompt.innerHTML = "Cursor mode"
    if (mode=="line") prompt.innerHTML = "Select line start"
}


function resetModels(){
    clearStates()
    models = {
        "lines" : [],
        "squares": [],
        "rectangles": []
    }
    render()
}


function handleLineClick(x, y){
    if (pendingLine.start === null){
        // add start of line
        pendingLine.start = [x, y]
        prompt.innerHTML = "Select line end"
    }
    else if (pendingLine.end === null){
        // add end of line
        pendingLine.end = [x, y]
        models['lines'].push(pendingLine)
        pendingLine = new Line()
        render()
        prompt.innerHTML = "Select line start"
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
}

/*
    Listeners
*/
cursorButton.addEventListener("click", () => {changeState("cursor")})
lineButton.addEventListener("click", () => {changeState("line")})
squareButton.addEventListener("click", () => {changeState("square")})
clearButton.addEventListener("click", () => {resetModels()})

canvas.addEventListener('mousedown', function(e) {
    handleClick(canvas, e)
})

