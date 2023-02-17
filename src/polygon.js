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
    
    render(gl, program){
        // render the polygon
        var vertices = flatten2d(to_float_pts(this.points, gl.canvas))
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