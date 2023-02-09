// changes screen x coordinates to gl float coordinates
function to_float_x(pos, size){
    mid = size / 2
    return pos / mid - 1
}

// changes screen y coordinates to gl float coordinates
function to_float_y(pos, size){
    mid = size / 2
    return 1 - pos / mid
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