class Square {

    constructor (){
        this.center = null
        this.pivot = null
        this.length = null
        this.points = []
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

        let vertices = to_float_pts(this.points, gl.canvas)

        var colors = [
            [1,0,0,1],
            [1,0,0,1],
            [1,0,0,1],
            [1,0,0,1],
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