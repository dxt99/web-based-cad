class Rectangle{
    constructor() {
        this.start = null
        this.end = null
    }

    isPointOn(x, y, delta = 5) {
        // TODO
        return true;
    }

    getSize(){
        return (
            Math.abs(this.start[0] - this.end[0]),
            Math.abs(this.start[1] - this.end[1])
        )
    }

    render(gl, program){
        var vertices = [
            this.start[0],
            this.start[1],
            this.start[0],
            this.end[1],
            this.end[0],
            this.end[1],
            this.end[0],
            this.start[1]
        ];
        
        var vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
        program.vertexPosAttrib = gl.getAttribLocation(program, 'pos');
        gl.enableVertexAttribArray(program.vertexPosAttrib);
        gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
}