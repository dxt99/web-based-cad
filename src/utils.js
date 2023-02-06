function to_float_x(pos, size){
    mid = size / 2
    return pos / mid - 1
}

function to_float_y(pos, size){
    mid = size / 2
    return 1 - pos / mid
}