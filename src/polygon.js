class Polygon{
    constructor() {
        this.points = []
        this.colors = []
        this.rotation = 0
        this.dilation = 1
    }

    copy(data){
        this.points = data["points"]
        this.colors = data["colors"]
        this.rotation = data["rotation"]
        this.dilation = data["dilation"]
    }

    isOnModel(x,y) {
        // check if point is inside polygon
        var minX = this.points[0][0], maxX = this.points[0][0]
        var minY = this.points[0][1], maxY = this.points[0][1]

        for (let i = 1; i < this.points.length; i++) {
            var p = this.points[i]
            minX = Math.min(p[0], minX)
            maxX = Math.max(p[0], maxX)
            minY = Math.min(p[1], minY)
            maxY = Math.max(p[1], maxY)
        }

        if (x < minX || x > maxX || y < minY || y > maxY) {
            return false
        }

        var intersections = 0
        for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
            var xi = this.points[i][0], yi = this.points[i][1]
            var xj = this.points[j][0], yj = this.points[j][1]

            if (((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
                intersections++;
            }
        }
        return intersections % 2 != 0
    }

    isOnVertex(x, y, delta = 5) {
        for(let i=0; i<this.points.length; i++){
            if (euclidian(this.points[i], [x, y]) <= delta){
                return true
            }
        }
        return false
    }

    changeColor(point, color, delta = 5){
        for(let i=0; i<this.points.length; i++){
            if(euclidian(this.points[i], point) <= delta){
                this.colors[i] = color
            }
        }
    }

    changePoint(pointOrigin, pointDestination, delta = 5){
        for(let i=0; i<this.points.length; i++){
            if(euclidian(this.points[i], pointOrigin) <= delta){
                this.points[i] = pointDestination
            }
        }
    }

    render(gl, program){
        // render the polygon
        let dict = {}
        for(let i=0; i<this.points.length; i++){
            dict[this.points[i]] = this.colors[i] 
        }
        let pts = convex_hull(this.points)
        this.points = pts
        this.colors = []
        pts.forEach(pt => {
            this.colors.push(dict[pt])
        })
        pts = rotate(pts, this.rotation)
        pts = dilate(pts, this.dilation)

        var vertices = flatten2d(to_float_pts(pts, gl.canvas))
        var colors = flatten2d(this.colors)

        var vertexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
        program.vertexPosAttrib = gl.getAttribLocation(program, 'pos')
        gl.enableVertexAttribArray(program.vertexPosAttrib)
        gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

        var colorBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
        program.vertexColorAttrib = gl.getAttribLocation(program, 'vColor')
        gl.enableVertexAttribArray(program.vertexColorAttrib)
        gl.vertexAttribPointer(program.vertexColorAttrib, 4, gl.FLOAT, false, 0, 0)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.points.length)
    }
}