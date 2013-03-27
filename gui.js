var radius = 7;
var height = 300;
var width = 300;
var mag_factor = 300;
var offset_x = 150;
var offset_y = 150;
var point_placement = true;
var shift_pressed = false;

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
    this.x = transform_x(x);
    this.y = transform_y(y);
    this.get_x = function(){
        return inv_transform_x(this.x);
    };
    this.get_y = function(){
        return inv_transform_y(this.y);
    };
    this.primal = primal;
    this.dual = dual;

    this.circle = this.primal.circle(this.x,this.y,radius);

    this.circle.drag(function(dx,dy){
            p.x = this.ox + dx;
            p.y = this.oy + dy;
            this.attr({cx: p.x, cy: p.y});
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

    // Sets the fill attribute of the circle to red (#f00)
    this.circle.attr("fill",color); 
    // Sets the stroke attribute of the circle to white
    this.circle.attr("stroke", "#fff");

    this.update_dual = function(){
        p.dual_point = dualize_point(p.get_x(),p.get_y(),"Geometric");
        p.line = p.dual.path("M " + String(transform_x(p.dual_point['x1'])) + " " + String(transform_y(p.dual_point['y1'])) + " L " + String(transform_x(p.dual_point['x2'])) + " " + String(transform_y(p.dual_point['y2'])));
        p.line.attr("stroke",p.color);
    };

    this.update_dual();

    return this;
}

function add_line(paper,x1,y1,x2,y2){
    x1 = transform_x(x1);
    y1 = transform_y(y1);
    x2 = transform_x(x2);
    y2 = transform_y(y2);

    var line = paper.path("M " + String(x1) + " " + String(y1) + " L " + String(x2) + " " + String(y2));
}

$(function(){
    var primal = Raphael("primal", width, height);
    var dual = Raphael("dual", width, height);

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

    new Point(.2,.2,primal,dual,"#f00");
    new Point(.3,.3,primal,dual,"#f00");
    new Point(.4,.4,primal,dual,"#f00");
    new Point(.2,-.2,primal,dual,"#00f");
    new Point(.3,-.3,primal,dual,"#00f");
    new Point(.4,-.4,primal,dual,"#00f");

    var prev_x = false;
    var prev_y = false;
    for(var x = -2.0; x<2.0; x+=.05){
        var y = x*x/2.0;
        if(prev_x && prev_y){
            add_line(dual,prev_x,prev_y,x,y);
            add_line(primal,prev_x,prev_y,x,y);
        }
        prev_x = x;
        prev_y = y;
    }
});
