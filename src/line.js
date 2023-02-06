class Line{
    constructor() {
        this.start = null
        this.end = null
    }

    isPointOn(x, y, delta = 5) {
        f = false
        if (this.start !== null && euclidian([x, y], this.start) <= delta){
            f = true         
        }
        if (this.end !== null && euclidian([x, y], this.end) <= delta){
            f = true         
        }
        return f
    }

    render(gl){

    }
}