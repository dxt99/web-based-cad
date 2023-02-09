class Rectangle{
    constructor() {
        this.start = null // upper left corner
        this.end = null // lower right corner
        this.startColor = null
        this.endColor = null

        this.vertexRight = null
        this.rightColor = null
        this.vertexLeft = null
        this.leftColor = null
    }

    copy(data){
        this.start = data["start"]
        this.end = data["end"]
        this.startColor = data["startColor"]
        this.endColor = data["endColor"]
        this.vertexRight = data["vertexRight"]
        this.rightColor = data["rightColor"]
        this.vertexLeft = data["vertexLeft"]
        this.leftColor = data["leftColor"]
    }

    isOnModel(x, y, delta = 0) {
        return x>=this.start[0] && x<=this.end[0] && y<=this.start[1] && y>=this.end[1]
    }

    isOnVertex(x, y, delta = 0){
        
    }

    getSize(){
        return [
            Math.abs(this.start[0] - this.end[0]),
            Math.abs(this.start[1] - this.end[1])
        ]
    }

    setWidth(len){
        mid = (this.start[0] + this.end[0]) / 2
        this.start[0] = mid - (len / 2)
        this.end[0] = mid + (len / 2)
    }

    setHeight(len){
        mid = (this.start[1] + this.end[1]) / 2
        this.start[1] = mid + (len / 2)
        this.end[1] = mid - (len / 2)
    }

    render(gl, program){
        if (this.start[0] > this.end[0]){
            [this.start, this.end] = [this.end, this.start]
            [this.startColor, this.endColor] = [this.endColor, this.startColor]
            [this.rightColor, this.leftColor] = [this.leftColor, this.rightColor]
        }
        this.vertexRight = [this.end[0], this.start[1]]
        this.vertexLeft = [this.start[0], this.end[1]]
        if (this.rightColor === null)this.rightColor = this.startColor
        if (this.leftColor === null)this.leftColor = this.endColor
        var vertices = flatten2d([
            this.start,
            this.vertexRight,
            this.end,
            this.vertexLeft
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