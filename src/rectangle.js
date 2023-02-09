class Rectangle{
    constructor() {
        this.start = null
        this.end = null
        this.startColor = null
        this.endColor = null

        this.vertexRight = null
        this.rightColor = null
        this.vertextLeft = null
        this.leftColor = null
    }

    isModelOn(x, y, delta = 0.01) {
        // TODO
        return true;
    }

    isPointOn(x, y, delta = 0.01){

    }

    getSize(){
        return (
            Math.abs(this.start[0] - this.end[0]),
            Math.abs(this.start[1] - this.end[1])
        )
    }

    render(gl, program){
        this.vertexRight = [this.end[0], this.start[1]]
        this.vertextLeft = [this.start[0], this.end[1]]
        if (this.rightColor === null)this.rightColor = this.startColor
        if (this.leftColor === null)this.leftColor = this.endColor
        var vertices = flatten2d([
            this.start,
            this.vertexRight,
            this.end,
            this.vertextLeft
        ])

        var colors = flatten2d([
            this.startColor,
            this.rightColor,
            this.endColor,
            this.leftColor
        ])
        
        var vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
        program.vertexPosAttrib = gl.getAttribLocation(program, 'pos');
        gl.enableVertexAttribArray(program.vertexPosAttrib);
        gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var vertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
        program.vertexColAttrib = gl.getAttribLocation(program, 'vColor');
        gl.enableVertexAttribArray(program.vertexColAttrib);
        gl.vertexAttribPointer(program.vertexColAttrib, 4, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
}