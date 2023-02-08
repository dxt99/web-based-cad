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
            this.start[0],
            this.start[1],
            this.end[0],
            this.end[1],
        ];
        
        var vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
        program.vertexPosAttrib = gl.getAttribLocation(program, 'pos');
        gl.enableVertexAttribArray(program.vertexPosAttrib);
        gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.drawArrays(gl.LINES, 0, 3);
    }
}