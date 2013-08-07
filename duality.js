function dualize_line(m, b, type)
{
    if (type == "Geometric")
        return {'x' : m,  'y' : -b};
    else
        return {'x' : m,  'y' : -b};
}
function dualize_point(x, y, type)
{
    x = x*8;
    if (type == "Geometric")
    {
        return {'x1' : -1, 'y1' : -x-y, 'x2' : 1, 'y2' : x-y}
    }
    else
        return {'x1' : -1, 'y1' : -x-y, 'x2' : 1, 'y2' : x-y}
}
