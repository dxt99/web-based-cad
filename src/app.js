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
const saveButton = document.getElementById("save")

const prompt = document.getElementById("prompt")
const actionDisplay = document.getElementById("actionDisplay")

const lineForm = document.getElementById("lineForm")
const lineLengthButton = document.getElementById("submitLineLength")

const rectangleForm = document.getElementById("rectangleForm")
const rectangleSizeButton = document.getElementById("submitRectangleSize")

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
    pendingModel->  model to be drawn, model type depends on mode of operation
    selectedModel -> model to be operated on, type depends on mode of operation
    models -> all models that are going to be rendered
*/
let mode = "cursor";
let pendingModel = null
let selectedModel = null
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

    for (const [_key, value] of Object.entries(models)) {
        value.forEach(model => {
            model.render(gl, program)
        })
    }
    window.requestAnimFrame(render)
}
/* 
    Listener logic
*/
function saveAllModels(){
    const file = new File([JSON.stringify(models)], 'save.json', {
        type: 'text/json',
    })
    const link = document.createElement('a')
    const url = URL.createObjectURL(file)

    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}

function clearStates(){
    // clears all pending states
    pendingModel = null
    selectedModel = null
    lineForm.style.display = "none"
    rectangleForm.style.display = "none"
    actionDisplay.style.display = "none"
}

function changeState(newMode){
    // changes mode of operations
    console.log(newMode)
    mode = newMode
    clearStates()
    if (mode=="cursor") prompt.innerHTML = "Cursor mode"
    if (mode=="line"){
        prompt.innerHTML = "Select line start"
        pendingModel = new Line()
    }
    if (mode=="rectangle"){
        prompt.innerHTML = "Select rectangle upper left corner"
        pendingModel = new Rectangle()
    }
}


function resetModels(){
    // deletes all models
    changeState("cursor")
    models = {
        "lines" : [],
        "squares": [],
        "rectangles": []
    }
}

// returns model that is on this coordinate
function getOnCoord(x, y){
    for (const [key, value] of Object.entries(models)) {
        for (const [_idx, model] of Object.entries(value)){
            if (model.isOnModel(x, y) == true){
                return [key, model]
            }
        }
    }
    return ["none", null]
}

function changeColor(){
    // changes current color
    let color = colorPicker.value
    let red = parseInt(color.slice(1, 3), 16)
    let green = parseInt(color.slice(3, 5), 16)
    let blue = parseInt(color.slice(5, 7), 16)
    curColor = [red/255.0, green/255.0, blue/255.0, 1.0]
}


function handleLineClick(x, y){
    if (pendingModel.start === null){
        // add start of line
        pendingModel.start = [x, y]
        pendingModel.startColor = curColor
        prompt.innerHTML = "Select line end"
    }
    else if (pendingModel.end === null){
        // add end of line
        pendingModel.end = [x, y]
        pendingModel.endColor = curColor
        models['lines'].push(pendingModel)
        pendingModel = new Line()
        prompt.innerHTML = "Select line start"
    }
}

function handleLineSelect(){
    let ret = selectedModel.getLength()
    actionDisplay.style.display = "block"
    actionDisplay.innerHTML = `
        <p>Current length: ${to_pixel_x(ret, gl.canvas)}</p>
    `
    lineForm.style.display = "block"
}

function changeLineSize(){
    var index = models["lines"].indexOf(selectedModel);
    if (index !== -1) {
        models["lines"].splice(index, 1);
    }
    try{
        let val = parseFloat(document.getElementById("lineLength").value)
        val = to_gl_x(val, gl.canvas)
        selectedModel.setLength(val)
    }catch{}
    
    models["lines"].push(selectedModel)
    handleLineSelect()
}

function handleRectangleClick(x, y){
    if (pendingModel.start === null){
        // add start of rectangle
        pendingModel.start = [x, y]
        pendingModel.startColor = curColor
        prompt.innerHTML = "Select rectangle lower right corner"
    }
    else if (pendingModel.end === null){
        // add end of line
        pendingModel.end = [x, y]
        pendingModel.endColor = curColor

        models['rectangles'].push(pendingModel)
        pendingModel = new Rectangle()
        prompt.innerHTML = "Select rectangle upper left corner"
    }
}

function handleRectangleSelect(){
    let ret = selectedModel.getSize()
    let width = ret[0]
    let height = ret[1]
    console.log("Changing element")
    actionDisplay.style.display = "block"
    actionDisplay.innerHTML = `
        <p>Current size: w = ${to_pixel_x(width, gl.canvas)}, 
        h = ${to_pixel_y(height, gl.canvas)}</p>
    `
    rectangleForm.style.display = "block"
}

function changeRectangleSize(){
    var index = models["rectangles"].indexOf(selectedModel);
    if (index !== -1) {
        models["rectangles"].splice(index, 1);
    }
    try{
        let val = parseFloat(document.getElementById("fname").value)
        val = to_gl_x(val, gl.canvas)
        selectedModel.setWidth(val)
    }catch{}
    try{
        let val = parseFloat(document.getElementById("lname").value)
        val = to_gl_y(val, gl.canvas)
        selectedModel.setHeight(val)
    }catch{}
    
    models["rectangles"].push(selectedModel)
    handleRectangleSelect()
}

function handleClick(canvas, event){
    // handles clicks on canvas
    let x = (event.clientX - rect.left) * canvas.width/canvas.clientWidth
    let y = (event.clientY - rect.top) * canvas.height/canvas.clientHeight
    x = to_float_x(x, gl.canvas)
    y = to_float_y(y, gl.canvas)
    // checks for current mode
    if (mode=="cursor"){
        // check if a model is clicked
        let ret = getOnCoord(x, y)
        let type = ret[0]
        let model = ret[1]
        selectedModel = model
        if (type == "lines") handleLineSelect()
        if (type == "rectangles")handleRectangleSelect()
    }
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
saveButton.addEventListener("click", () => {saveAllModels()})

lineLengthButton.addEventListener("click", () => {changeLineSize()})
rectangleSizeButton.addEventListener("click", () => {changeRectangleSize()})

canvas.addEventListener('mousedown', function(e) {
    handleClick(canvas, e)
})
colorPicker.addEventListener("change", () => {changeColor()})

render()