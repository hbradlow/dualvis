$(function(){

    var radius = 8;
    var height = $("#primal").height();
    var width = $("#primal").width();
    var mag_factor = width;
    var offset_x = width/2.0;
    var offset_y = height/2.0;
    var point_placement = true;
    var shift_pressed = false;

    var primal = Raphael("primal", width, height);
    var dual = Raphael("dual", width, height);

    var points = [
        new Point(0,0,primal,dual,"#f00"),
        new Point(-.3,0,primal,dual,"#f00"),
        new Point(.3,0,primal,dual,"#f00"),
        new Point(0,0,dual,primal,"#00f"),
        new Point(.3,.045,dual,primal,"#00f"),
        new Point(-.3,.045,dual,primal,"#00f"),
    ];


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
        for(var x = -2.0; x<2.0; x+=.05){
            var y = x*x/2.0;
            if(prev_x && prev_y && draw){
                lines.push(add_line(dual,prev_x,prev_y,x,y));
                lines.push(add_line(primal,prev_x,prev_y,x,y));
            }
            prev_x = x;
            prev_y = y;
        }
        //draw_axis();
    }
    function draw_axis()
    {
        lines.push(add_line(dual,0,0,1,0));
        lines.push(add_line(dual,0,0,0,1));
        lines.push(add_line(dual,0,0,-1,0));
        lines.push(add_line(dual,0,0,0,-1));

        lines.push(add_line(primal,0,0,1,0));
        lines.push(add_line(primal,0,0,0,1));
        lines.push(add_line(primal,0,0,-1,0));
        lines.push(add_line(primal,0,0,0,-1));
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
                    p.line.remove();
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
    });
    $("#dual").mouseup(function(e){
        if(point_placement && !shift_pressed){
            var x = inv_transform_x(e.offsetX);
            var y = inv_transform_y(e.offsetY);
            new Point(x,y,dual,primal,getRandomColor());
        }
    });
    $("#primal").mousedown(function(e){
        point_placement = true;
    });
    $("#primal").mouseup(function(e){
        if(point_placement && !shift_pressed){
            var x = inv_transform_x(e.offsetX);
            var y = inv_transform_y(e.offsetY);
            new Point(x,y,primal,dual,getRandomColor());
        }
    });
    $("body").keydown(function(e){
        if(e.shiftKey)
            shift_pressed = true;
    });
    $("body").keyup(function(e){
        shift_pressed = false;
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
