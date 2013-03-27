function dualize_line(m, b, type)
{
    if (type == "Geometric")
        return {'x' : m,  'y' : -b};
    else
        return {'x' : m,  'y' : -b};
}
function dualize_point(x, y, type)
{
    if (type == "Geometric")
    {
        return {'x1' : 0, 'y1' : y, 'x2' : 1, 'y2' : x}
    }
    else
        return {'x1' : 0, 'y1' : y, 'x2' : 1, 'y2' : x}
}
