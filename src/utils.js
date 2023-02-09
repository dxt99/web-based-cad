// changes screen x coordinates to gl float coordinates
function to_float_x(pos, canvas){
    size = canvas.width
    mid = size / 2
    return pos / mid - 1
}

// changes screen y coordinates to gl float coordinates
function to_float_y(pos, canvas){
    size = canvas.height
    mid = size / 2
    return 1 - pos / mid
}

// changes screen length to gl length
function to_gl_x(len, canvas){
    size = canvas.width
    return len * 2 / size
}
function to_gl_y(len, canvas){
    size = canvas.height
    return len * 2 / size
}

// changes gl length to screen length
function to_pixel_x(len, canvas){
    size = canvas.width
    return len * size / 2
}
function to_pixel_y(len, canvas){
    size = canvas.height
    return len * size / 2
}   


// converts 2d array to 1d array
function flatten2d(arr){
    ret = []
    arr.forEach(li =>{
        li.forEach(e => {
            ret.push(e)
        })
    })
    return ret
}

// euclidian distance of two points p1 and p2
function euclidian(p1, p2){
    let dx = Math.abs(p1[0] - p2[0])
    let dy = Math.abs(p1[1] - p2[1])
    return Math.sqrt(dx*dx + dy*dy)
}