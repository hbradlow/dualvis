var activeColor = "#f00";
$(function(){

    var radius = 8;
    var height = $("#primal").height();
    var width = $("#primal").width();
    var mag_factor = width;
    var offset_x = width/2.0;
    var offset_y = height/2.0;
    var point_placement = true;
    var shift_pressed = false;
    var x_scale = 8;

    var primal = Raphael("primal", width, height);
    var dual = Raphael("dual", width, height);

    function dualize_line(m, b, type)
    {
        if (type == "Geometric")
            return {'x' : m,  'y' : -b};
        else
            return {'x' : m,  'y' : -b};
    }
    function dualize_point(x, y, type)
    {
        x = x*x_scale;
        if (type == "Geometric")
        {
            return {'x1' : -1, 'y1' : -x-y, 'x2' : 1, 'y2' : x-y}
        }
        else
            return {'x1' : -1, 'y1' : -x-y, 'x2' : 1, 'y2' : x-y}
    }

    var href = location.href;
    var href_untouched = href;
    var index = href.indexOf("#");
    var points = [];
    if(index!=-1){
        var params = href.slice(index+1);
        href_untouched = href_untouched.slice(0,index);
        ps = params.split(";");
        for(i in ps){
            var p = ps[i].split(",");
            if(p.length==4){
                var x = parseFloat(p[0].slice(p[0].indexOf("=")+1));
                var y = parseFloat(p[1].slice(p[1].indexOf("=")+1));
                var c = p[2].slice(p[2].indexOf("=")+1);
                var d = p[3].slice(p[3].indexOf("=")+1);
                if(d=="0")
                    points = points.concat(new Point(x,y,primal,dual,"#"+c));
                if(d=="1")
                    points = points.concat(new Point(x,y,dual,primal,"#"+c));
            }
        }
        update_href();
    }
    else{
        var points = [
            new Point(0,0,primal,dual,"#f00"),
            new Point(-.2,0,primal,dual,"#f00"),
            new Point(.2,0,primal,dual,"#f00"),
            new Point(0,0,dual,primal,"#00f"),
            new Point(.2,.02*x_scale,dual,primal,"#00f"),
            new Point(-.2,.02*x_scale,dual,primal,"#00f"),
        ];
        update_href();
    }
    function get_href_list(ps){
        var s = "";
        for(i in ps){
            var p = ps[i];
            s += "x=" + (""+p.x).slice(0,7) + ",";
            s += "y=" + (""+p.y).slice(0,7) + ",";
            s += "c=" + p.color.replace("#","") + ",";
            if(p.dual == dual){
                s += "d=0;"
            }
            else{
                s += "d=1;"
            }
        }
        return s;
    }
    function update_href(){
        location.href = href_untouched+"#"+get_href_list(points);
        $("#link").val(location.href);
    }

    var lines = [];
    function draw_parabola(){
        for(var i = 0; i<lines.length; i++)
        {
            lines[i].remove();
        }
        lines = [];
        var prev_x = false;
        var prev_y = false;
        var draw = true;
        for(var x = -2.0; x<2.0; x+=.02){
            var y = x_scale*x*x/2.0;
            if(prev_x && prev_y && draw){
                lines.push(add_line(dual,prev_x,prev_y,x,y));
                lines.push(add_line(primal,prev_x,prev_y,x,y));
            }
            prev_x = x;
            prev_y = y;
        }
        draw_axis();
    }
    function draw_axis()
    {
        var color = "#AAA";
        var dash = "--";
        lines.push(add_line(dual,-1,0,1,0).attr("stroke", color).attr({'stroke-dasharray': dash}));
        lines.push(add_line(dual,0,-1,0,1).attr("stroke", color).attr({'stroke-dasharray': dash}));

        lines.push(add_line(primal,-1,0,1,0).attr("stroke", color).attr({'stroke-dasharray': dash}));
        lines.push(add_line(primal,0,-1,0,1).attr("stroke", color).attr({'stroke-dasharray': dash}));
    }

    function resize(){
        mag_factor = width;
        offset_x = width/2.0;
        offset_y = height/2.0;
        primal.setSize(width,height);
        dual.setSize(width,height);
    }
    function transform_x(x){
        return (x*mag_factor)+offset_x;
    }
    function transform_y(y){
        return (-(y*mag_factor))+offset_y;
    }
    function inv_transform_x(x){
        return (x-offset_x)/mag_factor;
    }
    function inv_transform_y(y){
        return -(y-offset_y)/mag_factor;
    }

    function Point(x,y,primal,dual,color){
        var p = this;
        this.color = color;
        this.x = x;
        this.y = y;
        this.get_x = function(){
            return p.x;
        };
        this.get_y = function(){
            return p.y;
        };
        this.primal = primal;
        this.dual = dual;
        this.resize = function(){
            this.circle.attr({cx: transform_x(this.x), cy: transform_y(this.y)});
            p.line.remove();
            p.update_dual();
        };

        this.circle = this.primal.circle(transform_x(this.x),transform_y(this.y),radius);
        this.circle.attr("fill",this.color); 
        this.circle.attr("stroke", "#fff");

        this.circle.drag(function(dx,dy){
                this.toFront();
                var x = this.ox + dx;
                var y = this.oy + dy;
                if (x - radius > 0 && x + radius < width)
                {
                    p.x = inv_transform_x(x);
                    this.attr({cx: x});
                }
                else if (x - radius <= 0)
                {
                    p.x = inv_transform_x(radius);
                    this.attr({cx: radius});
                }
                else
                {
                    p.x = inv_transform_x(width-radius);
                    this.attr({cx: width-radius});
                }
                if (y - radius > 0 && y + radius < height)
                {
                    p.y = inv_transform_y(y);
                    this.attr({cy: y});
                }
                else if (y - radius <= 0)
                {
                    p.y = inv_transform_y(radius);
                    this.attr({cy: radius});
                }
                else
                {
                    p.y = inv_transform_y(height-radius);
                    this.attr({cy: height-radius});
                }
                p.line.remove();
                p.update_dual();
                point_placement = false;
            },function(){
                this.ox = this.attr("cx");
                this.oy = this.attr("cy");
                if(shift_pressed){
                    p.circle.remove();

                    //remove the point from the points list
                    i = points.indexOf(p);
                    points = points.slice(0,i).concat(points.slice(i+1));

                    p.line.remove();
                    update_href();
                }
            }
        );


        this.update_dual = function(){
            p.dual_point = dualize_point(p.get_x(),p.get_y(),"Geometric");
            p.line = p.dual.path("M " + String(transform_x(p.dual_point['x1'])) + " " + String(transform_y(p.dual_point['y1'])) + " L " + String(transform_x(p.dual_point['x2'])) + " " + String(transform_y(p.dual_point['y2'])));
            p.line.attr("stroke",p.color);
            p.line.attr("stroke-width", "3");
            p.line.toBack();

        };

        this.update_dual();
    }
    function getRandomColor() {
        // creating a random number between 0 and 255
        var r = Math.floor(Math.random()*256);
        var g = Math.floor(Math.random()*256);
        var b = Math.floor(Math.random()*256);
         
        // going from decimal to hex
        var hexR = r.toString(16);
        var hexG = g.toString(16);
        var hexB = b.toString(16);
         
        // making sure single character values are prepended with a "0"
        if (hexR.length == 1) {
        hexR = "0" + hexR;
        }
         
        if (hexG.length == 1) {
        hexG = "0" + hexG;
        }
         
        if (hexB.length == 1) {
        hexB = "0" + hexB;
        }
         
        // creating the hex value by concatenatening the string values
        var hexColor = "#" + hexR + hexG + hexB;
        return hexColor.toUpperCase();
    }
    function add_line(paper,x1,y1,x2,y2){
        x1 = transform_x(x1);
        y1 = transform_y(y1);
        x2 = transform_x(x2);
        y2 = transform_y(y2);

        var line = paper.path("M " + String(x1) + " " + String(y1) + " L " + String(x2) + " " + String(y2));
        line.toBack();
        return line;
    }
    $("#dual").mousedown(function(e){
        point_placement = true;
        update_href();
    });
    $("#dual").mouseup(function(e){
        if(point_placement && !shift_pressed){
            var x = inv_transform_x(e.pageX-$("#dual").offset().left);
            var y = inv_transform_y(e.pageY-$("#dual").offset().top);
            points.push(new Point(x,y,dual,primal,activeColor));
        }
        update_href();
    });
    $("#primal").mousedown(function(e){
        point_placement = true;
        update_href();
    });
    $("#primal").mouseup(function(e){
        if(point_placement && !shift_pressed){
            var x = inv_transform_x(e.pageX-$("#primal").offset().left);
            var y = inv_transform_y(e.pageY-$("#primal").offset().top);
            points.push(new Point(x,y,primal,dual,activeColor));
        }
        update_href();
    });
    $("body").keydown(function(e){
        if(e.shiftKey)
            shift_pressed = true;
        update_href();
    });
    $("body").keyup(function(e){
        shift_pressed = false;
        update_href();
    });

    $(window).resize(function () { 
        width = $("#primal").width();
        height = $("#primal").height();
        resize();
        for(var i = 0; i<points.length; i++){
            points[i].resize();
        }
        draw_parabola();
    });

    draw_parabola();
});
