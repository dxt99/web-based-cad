class Rectangle{
    constructor() {
        this.points = [] //0, 1
                        // 3, 2
        this.colors = []
    }

    rotate(val){
        this.points = rotate_pts(this.points, val)
    }

    dilate(val){
        this.points = dilate_pts(this.points, val)
    }

    copy(data){
        this.points = data["points"]
        this.colors = data["colors"]
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

    isOnVertex(x, y, delta = 30) {
        for(let i=0; i<this.points.length; i++){
            if (euclidian(this.points[i], [x, y]) <= delta){
                return true
            }
        }
        return false
    }

    changeColor(point, color, delta = 20){
        for(let i=0; i<this.points.length; i++){
            if(euclidian(this.points[i], point) <= delta){
                this.colors[i] = color
            }
        }
    }

    changePoint(pointOrigin, pointDestination, delta = 30){
        for(let i=0; i<this.points.length; i++){
            if(euclidian(this.points[i], pointOrigin) <= delta){
                pointOrigin = this.points[i]
                if (Math.abs(pointOrigin[0] - pointDestination[0]) < Math.abs(pointOrigin[1]-pointDestination[1])){
                    pointDestination[0] = pointOrigin[0]
                }else pointDestination[1] = pointOrigin[1]
                this.points = translate(this.points, [pointDestination[0] - pointOrigin[0], pointDestination[1] - pointOrigin[1]])
                return
            }
        }
    }

    getSize(){ // w, h
        return [
            euclidian(this.points[0], this.points[1]),
            euclidian(this.points[0], this.points[3])
        ]
    }

    setWidth(len){
        let cur = this.getSize()[0]
        let mid = centroid([this.points[0], this.points[1]])
        let pts = translate([this.points[0], this.points[1]], [-1*mid[0], -1*mid[1]])
        pts = dilate_pts(pts, len/cur)
        pts = translate(pts, mid)

        this.points[0] = pts[0]
        this.points[1] = pts[1]
        

        mid = centroid([this.points[2], this.points[3]])
        pts = translate([this.points[2], this.points[3]], [-1*mid[0], -1*mid[1]])
        pts = dilate_pts(pts, len/cur)
        pts = translate(pts, mid)
        this.points[2] = pts[0]
        this.points[3] = pts[1]

    }

    setHeight(len){
        let cur = this.getSize()[1]
        let mid = centroid([this.points[0], this.points[3]])
        let pts = translate([this.points[0], this.points[3]], [-1*mid[0], -1*mid[1]])
        pts = dilate_pts(pts, len/cur)
        pts = translate(pts, mid)

        this.points[0] = pts[0]
        this.points[3] = pts[1]
        

        mid = centroid([this.points[1], this.points[2]])
        pts = translate([this.points[1], this.points[2]], [-1*mid[0], -1*mid[1]])
        pts = dilate_pts(pts, len/cur)
        pts = translate(pts, mid)
        this.points[1] = pts[0]
        this.points[2] = pts[1]
    }

    render(gl, program){
        let pts = this.points
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