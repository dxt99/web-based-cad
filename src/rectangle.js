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

        this.rotation = 0
        this.dilation = 1
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
        this.rotation = data["rotation"]
        this.dilation = data["dilation"]
    }

    isOnModel(x, y, delta = 0) {
        return x>=this.start[0] && x<=this.end[0] && y<=this.start[1] && y>=this.end[1]
    }

    isOnVertex(x, y, delta = 30){
        let points = [this.start, this.end, this.vertexLeft, this.vertexRight]
        for(let i=0; i<4; i++){
            let point = points[i]
            if (euclidian(point, [x, y]) <= delta) return true
        }
        return false
    }

    changeColor(point, color, delta = 20){
        if (euclidian(point, this.start) <= delta) this.startColor = color
        else if (euclidian(point, this.end) <= delta) this.endColor = color
        else if (euclidian(point, this.vertexRight) <= delta) this.rightColor = color
        else if (euclidian(point, this.vertexLeft) <= delta) this.leftColor = color
    }

    changePoint(pointOrigin, pointDestination, delta = 30){
        if (euclidian(pointOrigin, this.start) <= delta) this.start = pointDestination
        else if (euclidian(pointOrigin, this.end) <= delta) this.end = pointDestination
        else if (euclidian(point, this.vertexRight) <= delta){
            let tempStart = this.startColor
            let tempEnd = this.endColor

            this.start = pointDestination
            this.startColor = this.rightColor

            this.end = this.vertexLeft
            this.endColor = this.leftColor

            this.rightColor = tempStart
            this.leftColor = tempEnd
        }
        else if (euclidian(point, this.vertexLeft) <= delta){
            let tempStart = this.startColor
            let tempEnd = this.endColor

            this.start = this.right
            this.startColor = this.rightColor

            this.end = pointDestination
            this.endColor = this.leftColor

            this.rightColor = tempStart
            this.leftColor = tempEnd
        }
    }


    getSize(){
        return [
            Math.abs(this.start[0] - this.end[0]),
            Math.abs(this.start[1] - this.end[1])
        ]
    }

    setWidth(len){
        let mid = (this.start[0] + this.end[0]) / 2
        this.start[0] = mid - (len / 2)
        this.end[0] = mid + (len / 2)
    }

    setHeight(len){
        let mid = (this.start[1] + this.end[1]) / 2
        this.start[1] = mid + (len / 2)
        this.end[1] = mid - (len / 2)
    }

    render(gl, program){
        // make sure start is upper left and end is lower right
        if (this.start[0] < this.end[0] && this.start[1] < this.end[1]){
            this.end = [this.start, this.start = this.end][0]
            this.endColor = [this.startColor, this.startColor = this.endColor][0]
            this.rightColor = [this.leftColor, this.leftColor = this.rightColor][0]
        }
        if (this.start[0] > this.end[0] && this.start[1] > this.end[1]){
            let tempStart = this.start
            let tempEnd = this.end
            this.start = [tempEnd[0], tempStart[1]]
            this.end = [tempStart[0], tempEnd[1]]
            if (this.rightColor !== null) this.rightColor = [this.startColor, this.startColor = this.endColor][0]
            if (this.leftColor !== null) this.leftColor = [this.endColor, this.endColor = this.leftColor][0]
        }
        else if (this.start[0] > this.end[0]){
            this.end = [this.start, this.start = this.end][0]
            this.endColor = [this.startColor, this.startColor = this.endColor][0]
            this.rightColor = [this.leftColor, this.leftColor = this.rightColor][0]
        }
        this.vertexRight = [this.end[0], this.start[1]]
        this.vertexLeft = [this.start[0], this.end[1]]
        if (this.rightColor === null)this.rightColor = this.startColor
        if (this.leftColor === null)this.leftColor = this.endColor

        // start rendering
        let pts = [this.start, this.vertexRight, this.end, this.vertexLeft]
        pts = dilate(pts, this.dilation)
        pts = rotate(pts, this.rotation)
        var vertices = flatten2d(
            to_float_pts(pts, gl.canvas)
        )

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