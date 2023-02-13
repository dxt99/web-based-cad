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
const loadButton = document.getElementById("load")

const prompt = document.getElementById("prompt")
const actionDisplay = document.getElementById("actionDisplay")

const transformForm = document.getElementById("transformForm")
const transformButton = document.getElementById("submitTransform")

const lineForm = document.getElementById("lineForm")
const lineLengthButton = document.getElementById("submitLineLength")

const rectangleForm = document.getElementById("rectangleForm")
const rectangleSizeButton = document.getElementById("submitRectangleSize")

const squareForm = document.getElementById('squareForm')
const squareWidthButton = document.getElementById("submitSquareWidth")
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
let selectedType = null
let selectedModel = null
let models = {
    "lines" : [],
    "squares": [],
    "rectangles": [],
    "polygons": []
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
    data = JSON.stringify(models)
    const file = new File([data], `save_${new Date().getTime()}.json`, {
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

function loadAllModels(){
    var input = document.createElement('input');
    input.type = 'file';
    document.body.appendChild(input)
    input.onchange = e => { 
        // getting a hold of the file reference
        var file = e.target.files[0]; 

        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            var content = readerEvent.target.result; // this is the content!
            try{
                data = JSON.parse(content)
                newModels = {
                    "lines" : [],
                    "squares": [],
                    "rectangles": [],
                    "polygons": []
                }
                for (const [key, value] of Object.entries(data)) {
                    value.forEach(model => {
                        let newModel = null;
                        if (key === "lines") newModel = new Line()
                        if (key === "rectangles") newModel = new Rectangle()
                        newModel.copy(model)
                        console.log(newModel)
                        newModels[key].push(newModel)
                    })
                }
                resetModels()
                models = newModels
            }catch{
                // no need
            }
            
        }
    }
    input.click();
    document.body.removeChild(input)
}

function clearStates(){
    // clears all pending states
    pendingModel = null
    selectedType = null
    selectedModel = null
    transformForm.style.display = "none"
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
    if (mode=="square") {
        prompt.innerHTML = "Select square center"
        pendingModel = new Square()
    }
}


function resetModels(){
    // deletes all models
    changeState("cursor")
    models = {
        "lines" : [],
        "squares": [],
        "rectangles": [],
        "polygons": []
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

function updateTransformation(){
    // sets rotation and dilation values on selected model
    var index = models[selectedType].indexOf(selectedModel);
    if (index !== -1) {
        models[selectedType].splice(index, 1);
    }
    try{
        let val = parseFloat(document.getElementById("rotation").value)
        if (!isNaN(val))
            selectedModel.rotation += val
    }catch{}
    try{
        let val = parseFloat(document.getElementById("dilation").value)
        if (!isNaN(val))
            selectedModel.dilation *= val
    }catch{}
    models[selectedType].push(selectedModel)
    console.log(selectedModel)
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
        <p>Current length: ${ret}</p>
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
        if (!isNaN(val))
            selectedModel.setLength(val)
    }catch{}
    
    models["lines"].push(selectedModel)
    handleLineSelect()
}

function handleSquareClick(x,y){
    console.log("Fungsi handle kepanggil");
    if (pendingModel.center == null) {
        pendingModel.center = [x,y]
        pendingModel.color = curColor
        prompt.innerHTML = "Select square range"
    } else if (pendingModel.pivot == null){
        pendingModel.pivot = [x,y]
        models['squares'].push(pendingModel)
        console.log(pendingModel);
        pendingModel = new Square();
        prompt.innerHTML = "Select square center"
    }
}

function handleSquareSelect() {
    actionDisplay.style.display="block"
    squareForm.style.display="block"
}

function changeSquareWidth() {
    var index = models["squares"].indexOf(selectedModel);
    if (index !== -1) {
        models["squares"].splice(index, 1);
    }
    try{
        let val = parseFloat(document.getElementById("squareWidth").value)
        if (!isNaN(val))
            selectedModel.setWidth(val)
    }catch{}

    models["squares"].push(selectedModel)
    handleSquareSelect()
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
        <p>Current size: w = ${width}, 
        h = ${height}</p>
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
        if (!isNaN(val))
            selectedModel.setWidth(val)
    }catch{}
    try{
        let val = parseFloat(document.getElementById("lname").value)
        if (!isNaN(val))
            selectedModel.setHeight(val)
    }catch{}
    
    models["rectangles"].push(selectedModel)
    handleRectangleSelect()
}

function handleClick(canvas, event){
    // handles clicks on canvas
    let x = (event.clientX - rect.left) * canvas.width/canvas.clientWidth
    let y = (event.clientY - rect.top) * canvas.height/canvas.clientHeight
    y = canvas.clientHeight - y
    // checks for current mode
    if (mode=="cursor"){
        // check if a model is clicked
        let ret = getOnCoord(x, y)
        let type = ret[0]
        let model = ret[1]
        selectedType = type
        selectedModel = model
        // transformation form
        if (type !== "none")transformForm.style.display = "block"
        // model-specific form
        if (type === "lines")handleLineSelect()
        if (type === "rectangles")handleRectangleSelect()
        if (type === "squares")handleSquareSelect()
    }
    if (mode=="line")handleLineClick(x, y)
    if (mode=="rectangle")handleRectangleClick(x, y)
    if (mode=="square")handleSquareClick(x,y)
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
loadButton.addEventListener("click", () => {loadAllModels()})

transformButton.addEventListener("click", () => {updateTransformation()})
lineLengthButton.addEventListener("click", () => {changeLineSize()})
rectangleSizeButton.addEventListener("click", () => {changeRectangleSize()})
squareWidthButton.addEventListener("click",() => {changeSquareWidth()})

canvas.addEventListener('mousedown', function(e) {
    handleClick(canvas, e)
})
colorPicker.addEventListener("change", () => {changeColor()})

render()