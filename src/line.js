class Line{
    constructor() {
        this.start = null
        this.end = null
        this.startColor = null
        this.endColor = null
        this.rotation = 0
        this.dilation = 1
    }

    copy(data){
        this.start = data["start"]
        this.end = data["end"]
        this.startColor = data["startColor"]
        this.endColor = data["endColor"]
        this.rotation = data["rotation"]
        this.dilation = data["dilation"]
    }

    isOnVertex(x, y, delta = 5) {
        let points = [this.start, this.end]
        for(let i=0; i<4; i++){
            let point = points[i]
            if (euclidian(point, [x, y] <= delta)) return true
        }
        return false
    }

    getLength(){
        return euclidian(this.start, this.end)
    }

    setLength(len){
        let cur = this.getLength()
        console.log(cur, len)
        console.log(this)
        let mid = [
            (this.start[0] + this.end[0])/2,
            (this.start[1] + this.end[1])/2
        ]
        // cur / len = (x - mid) / (new - mid)
        // cur * new = len * x - len * mid + cur * mid
        this.start[0] = (len * this.start[0] + mid[0] * (cur - len)) / cur
        this.start[1] = (len * this.start[1] + mid[1] * (cur - len)) / cur
        this.end[0] = (len * this.end[0] + mid[0] * (cur - len)) / cur
        this.end[1] = (len * this.end[1] + mid[1] * (cur - len)) / cur
    }

    isOnModel(x, y, delta = 5){
        let dist = 2 * shoelace([[x, y], this.start, this.end]) / euclidian(this.start, this.end)
        return dist <= delta
    }

    render(gl, program){
        if (this.start[0] > this.end[0]){
            this.end = [this.start, this.start = this.end][0];
            this.endColor = [this.startColor, this.startColor = this.endColor][0];
        }

        let pts = [this.start, this.end]
        pts = dilate(pts, this.dilation)
        pts = rotate(pts, this.rotation)
        var vertices = flatten2d(
            to_float_pts(pts, gl.canvas)
        )

        var colors = flatten2d([
            this.startColor,
            this.endColor
        ])
        
        // Draw point
        var vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
        program.vertexPosAttrib = gl.getAttribLocation(program, 'pos');
        gl.enableVertexAttribArray(program.vertexPosAttrib);
        gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Vertex Color
        var vertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
        program.vertexColAttrib = gl.getAttribLocation(program, 'vColor');
        gl.enableVertexAttribArray(program.vertexColAttrib);
        gl.vertexAttribPointer(program.vertexColAttrib, 4, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.drawArrays(gl.LINES, 0, 3);
    }
}