function dualize_line(m, b, type)
{
    return {'x' : m,  'y' : -b};
}
function dualize_point(x, y, type)
{
    return {'slope' : x, 'intersect' : y}; 
}




