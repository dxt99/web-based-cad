class Line{
    constructor() {
        this.start = null
        this.end = null
    }

    isPointOn(x, y, delta = 5) {
        f = false
        if (this.start !== null && euclidian([x, y], this.start) <= delta){
            f = true         
        }
        if (this.end !== null && euclidian([x, y], this.end) <= delta){
            f = true         
        }
        return f
    }

    render(gl, program){
        var vertices = [
            to_float_x(this.start[0], gl.canvas.width), 
            to_float_y(this.start[1], gl.canvas.height), 
            to_float_x(this.end[0], gl.canvas.width),
            to_float_y(this.end[1], gl.canvas.height), 
        ];
        console.log(vertices)
        var vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
        program.vertexPosAttrib = gl.getAttribLocation(program, 'pos');
        gl.enableVertexAttribArray(program.vertexPosAttrib);
        gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.drawArrays(gl.LINES, 0, 3);
    }
}