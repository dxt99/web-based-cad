class Square {

    constructor (){
        this.center = null
        this.pivot = null
        this.length = null
        this.points = []
    }


    getPointByCenter(x_direction,y_direction,width,center){
        
        var x = (x_direction * width) + center[0]
        var y = (y_direction * width) + center[1]

        return [x,y]
        
    }

    generatePoints(center,width){
        
        const directions = [[1,1],[1,-1],[-1,1],[-1,-1]]

        directions.forEach((direction) => {

            this.points.push(this.getPointByCenter(direction[0],direction[1],
                width,center))
        })

    }

    /**@param {WebGLRenderingContext} gl */
    /**@param {WebGLProgram} program*/
    render(gl,program){

        let tempPoints = [this.center,this.pivot]

        tempPoints = to_float_pts(tempPoints,gl.canvas)

        this.center = tempPoints[0]
        this.pivot = tempPoints[1]

        console.log(this.center,this.pivot);

        
        this.length= distance(this.center,this.pivot)        

        this.generatePoints(this.center,this.length)

        console.log(flatten2d(this.points));

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
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten2d(this.points)), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        program.vertexColAttrib = gl.getAttribLocation(program, 'vColor');
        gl.enableVertexAttribArray(program.vertexColAttrib);
        gl.vertexAttribPointer(program.vertexColAttrib, 4, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        gl.drawArrays(gl.TRIANGLE_STRIIP,0,4)
    }
}