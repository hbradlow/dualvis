$(function(){

    var radius = 10;
    var height = $("#primal").height();
    var width = $("#primal").width();
    var mag_factor = width;
    var offset_x = width/2.0;
    var offset_y = height/2.0;
    var point_placement = true;
    var shift_pressed = false;
    var primal = Raphael("primal", width, height);
    var dual = Raphael("dual", width, height);

    var lines = [];
    function draw_parabola(){
        for(var i = 0; i<lines.length; i++)
        {
            lines[i].remove();
        }
        lines = [];
        var prev_x = false;
        var prev_y = false;
        for(var x = -2.0; x<2.0; x+=.05){
            var y = x*x/2.0;
            if(prev_x && prev_y){
                lines.push(add_line(dual,prev_x,prev_y,x,y));
                lines.push(add_line(primal,prev_x,prev_y,x,y));
            }
            prev_x = x;
            prev_y = y;
        }
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
                var x = this.ox + dx;
                var y = this.oy + dy;
                p.x = inv_transform_x(x);
                p.y = inv_transform_y(y);
                this.attr({cx: x, cy: y});
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
        };

        this.update_dual();
    }

    function add_line(paper,x1,y1,x2,y2){
        x1 = transform_x(x1);
        y1 = transform_y(y1);
        x2 = transform_x(x2);
        y2 = transform_y(y2);

        var line = paper.path("M " + String(x1) + " " + String(y1) + " L " + String(x2) + " " + String(y2));
        return line;
    }

    $("#dual").mousedown(function(e){
        point_placement = true;
    });
    $("#dual").mouseup(function(e){
        if(point_placement && !shift_pressed){
            var x = inv_transform_x(e.offsetX);
            var y = inv_transform_y(e.offsetY);
            new Point(x,y,dual,primal,"#000");
        }
    });
    $("#primal").mousedown(function(e){
        point_placement = true;
    });
    $("#primal").mouseup(function(e){
        if(point_placement && !shift_pressed){
            var x = inv_transform_x(e.offsetX);
            var y = inv_transform_y(e.offsetY);
            new Point(x,y,primal,dual,"#000");
        }
    });
    $("body").keydown(function(e){
        if(e.shiftKey)
            shift_pressed = true;
    });
    $("body").keyup(function(e){
        shift_pressed = false;
    });

    var points = [
        new Point(.2,.2,primal,dual,"#f00"),
        new Point(.3,.3,primal,dual,"#f00"),
        new Point(.4,.4,primal,dual,"#f00"),
        new Point(.2,-.2,primal,dual,"#00f"),
        new Point(.3,-.3,primal,dual,"#00f"),
        new Point(.4,-.4,primal,dual,"#00f")
    ];

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
