// get elements
let canvas = document.getElementById("canvas")
let cursorButton = document.getElementById("cursor")
let lineButton = document.getElementById("line")
let squareButton = document.getElementById("square")
let prompt = document.getElementById("prompt")

// webgl setup
const gl = WebGLUtils.setupWebGL(canvas);
const rect = canvas.getBoundingClientRect()


// Tell WebGL how to convert from clip space to pixels
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas
gl.clearColor(0, 0, 0, 0);

var vs = 'attribute vec2 pos;' +
				 'void main() { gl_Position = vec4(pos, 0, 1); }';
var fs = 'precision mediump float;' +
            'void main() { gl_FragColor = vec4(0,0,0,1); }';
var program = createProgram(vs,fs);
gl.useProgram(program);

// states
let mode = "cursor";
let pendingLine = new Line()
let models = {
    "lines" : [],
    "squares": []
}

// rendering
function render(){
    models['lines'].forEach(line => {
        line.render(gl, program)
    });
}

function changeState(newMode){
    // reset states
    console.log(newMode)
    pendingLine = new Line()
    mode = newMode
    console.log(mode)
    if (mode=="cursor") prompt.innerHTML = "Cursor mode"
    if (mode=="line") prompt.innerHTML = "Select line start"
}

function handleLineClick(x, y){
    if (pendingLine.start === null){
        pendingLine.start = [x, y]
        prompt.innerHTML = "Select line end"
    }
    else if (pendingLine.end === null){
        pendingLine.end = [x, y]
        models['lines'].push(pendingLine)
        pendingLine = new Line()
        render()
        prompt.innerHTML = "Select line start"
    }
}

function handleClick(canvas, event){
    const x = (event.clientX - rect.left) * canvas.width/canvas.clientWidth
    const y = (event.clientY - rect.top) * canvas.height/canvas.clientHeight
    console.log(x)
    console.log(y)
    if (mode=="line")handleLineClick(x, y)
}

// add listeners
cursorButton.addEventListener("click", () => {changeState("cursor")})
lineButton.addEventListener("click", () => {changeState("line")})
squareButton.addEventListener("click", () => {changeState("square")})

canvas.addEventListener('mousedown', function(e) {
    handleClick(canvas, e)
})

