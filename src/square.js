class Square {

    constructor (){
        this.center = null
        this.pivot = null
        this.width= null
        this.color = null
        this.rightUpColor = null
        this.leftUpColor = null
        this.rightDownColor = null
        this.leftDownColor = null
        this.dilation = 1
        this.rotation = 0
        this.points = []
    }

    copy(data){
        this.center = data["center"]
        this.pivot = data["pivot"]
        this.width = data["width"]
        this.color = data["color"]
        this.dilation = data["dilation"]
        this.rotation = data["rotation"]
        this.points = data["points"]
    }
    
    isColorEmpty(){
        return !this.rightDownColor && !this.rightUpColor &&
                !this.leftDownColor && !this.leftUpColor
    }

    isOnVertex(x, y, delta = 5){
        let points = this.points
        for(let i=0; i<4; i++){
            let point = points[i]
            if (euclidian(point, [x, y]) <= delta) return true
        }
        return false
    }

    changeColor(point,color,delta=20){
        if (euclidian(point, this.points[0]) <= delta) this.rightUpColor = color
        else if (euclidian(point, this.points[1]) <= delta) this.rightDownColor = color
        else if (euclidian(point, this.points[2]) <= delta) this.leftDownColor = color
        else if (euclidian(point, this.points[3]) <= delta) this.leftUpColor = color
    }

    changePoint(pointOrigin,pointDestination, delta=5) {
        // asumsi yang diklik itu bisa titik mana aja asal ada di vertex
        if (euclidian(pointOrigin,pointDestination)<=delta) {
            this.pivot = pointDestination 
        }
    }

    setWidth(width) {
        this.pivot = [this.center[0] + width,
                    this.center[1] + width]
    }

    isOnModel(x,y) {
        return x <= this.points[0][0] && y <= this.points[0][1]
         && x >= this.points[2][0] && y >= this.points[2][1]
    }

    getPointByCenter(x_direction,y_direction,width,center){
        
        let x = (x_direction * width) + center[0]
        let y = (y_direction * width) + center[1]
        return [x,y]
    }

    generatePoints(center, pivot){
        
        const directions = [[1,1],[1,-1],[-1,-1],[-1,1]]

        this.points = []
        let width = Math.max(
            Math.abs(pivot[0] - center[0]),
            Math.abs(pivot[1] - center[1])
        )

        directions.forEach((direction) => {

            this.points.push(this.getPointByCenter(direction[0],direction[1],
                width,center))
        })

    }

    /**@param {WebGLRenderingContext} gl */
    /**@param {WebGLProgram} program*/
    render(gl,program){               
        this.generatePoints(this.center,this.pivot)
        
        this.points = dilate(this.points, this.dilation)
        this.points = rotate(this.points, this.rotation)

        let vertices = to_float_pts(this.points, gl.canvas)

        if (this.isColorEmpty()) {
            this.rightUpColor = this.color
            this.rightDownColor = this.color
            this.leftDownColor = this.color
            this.leftUpColor = this.color
        }

        var colors = [
            this.rightUpColor,
            this.rightDownColor,
            this.leftDownColor,
            this.leftUpColor,
        ]

        var vertexBuffer = gl.createBuffer();
        var colorBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer)
        program.vertexPosAttrib = gl.getAttribLocation(program, 'pos');
        gl.enableVertexAttribArray(program.vertexPosAttrib);
        gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten2d(vertices)), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        program.vertexColAttrib = gl.getAttribLocation(program, 'vColor');
        gl.enableVertexAttribArray(program.vertexColAttrib);
        gl.vertexAttribPointer(program.vertexColAttrib, 4, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten2d(colors)), gl.STATIC_DRAW);

        gl.drawArrays(gl.TRIANGLE_FAN,0,4)
    }
}