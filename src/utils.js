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

// area of n ordered points
function shoelace(arr){
    n = arr.length
    a = arr[n-1][0] * arr[0][1] - arr[n-1][1] * arr[0][0]
    for(let i=0; i<n-1; i++){
        a += arr[i][0] * arr[i+1][1] - arr[i][1] * arr[i+1][0]
    }
    return Math.abs(a/2)
}

// calculates centroid of a set of points (2D)
function centroid(arr){
    centroid = [0, 0]
    arr.forEach(e => {
        centroid[0] += e[0] / arr.len
        centroid[1] += e[1] / arr.len
    })
    return centroid
}

// translates a set of points (2D)
function translate(arr, delta){
    for(let i=0; i<arr.len; i++){
        arr[i][0] += delta[0]
        arr[i][1] += delta[1]
    }
    return arr
}

// dilates a set of points from its centroid (2D)
function dilate(arr, mult){
    centroid = centroid(arr)
    arr = translate(arr, -1 * centroid)
    for(let i=0; i<arr.len; i++){
        arr[i][0] *= mult
        arr[i][1] *= mult
    }
    arr = translate(arr, centroid)
    return arr
}

// rotates a set of points from the origin (2D)
function rotate(arr, deg){
    centroid = centroid(arr)
    arr = translate(arr, -1 * centroid)
    let rad = deg * Math.PI/180
    for(let i=0; i<arr.len; i++){
        arr[i][0] = [
            arr[i][0] * Math.cos(rad) - arr[i] * Math.sin(rad),
            arr[i][1] =  arr[i][0] * Math.sin(rad) + arr[i] * Math.cos(rad)
        ][0]
    }
    arr = translate(arr, centroid)
    return arr
}