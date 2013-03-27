var radius = 10;
var height = 500;
var width = 500;
var mag_factor = 500;
var point_placement = true;

function Point(x,y,primal,dual,color){
    var p = this;
    this.color = color;
    this.x = x*mag_factor;
    this.y = y*mag_factor;
    this.get_x = function(){
        return this.x/mag_factor;
    };
    this.get_y = function(){
        return this.y/mag_factor;
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
        }
    );

    // Sets the fill attribute of the circle to red (#f00)
    this.circle.attr("fill",color); 
    // Sets the stroke attribute of the circle to white
    this.circle.attr("stroke", "#fff");

    this.update_dual = function(){
        p.dual_point = dualize_point(p.get_x(),p.get_y(),"Geometric");
        p.line = p.dual.path("M " + String(p.dual_point['x1']*mag_factor) + " " + String(p.dual_point['y1']*mag_factor) + " L " + String(p.dual_point['x2']*mag_factor) + " " + String(p.dual_point['y2']*mag_factor));
        p.line.attr("stroke",p.color);
    };

    this.update_dual();

    return this;
}

function add_line(paper,x1,y1,x2,y2){
    x1 = x1*mag_factor;
    y1 = y1*mag_factor;
    x2 = x2*mag_factor;
    y2 = y2*mag_factor;

    var line = paper.path("M " + String(x1) + " " + String(y1) + " L " + String(x2) + " " + String(y2));
}

$(function(){
    var primal = Raphael("primal", width, height);
    var dual = Raphael("dual", width, height);

    $("#primal").mousedown(function(e){
        point_placement = true;
    });
    $("#primal").mouseup(function(e){
        if(point_placement){
            var x = e.offsetX/mag_factor;
            var y = e.offsetY/mag_factor;
            new Point(x,y,primal,dual,"#000");
        }
    });

    new Point(.2,.2,primal,dual,"#f00");
    new Point(.3,.3,primal,dual,"#f00");
    new Point(.4,.4,primal,dual,"#f00");
    new Point(.5,.5,primal,dual,"#f00");
    new Point(.6,.6,primal,dual,"#00f");
    new Point(.7,.7,primal,dual,"#00f");
    new Point(.8,.8,primal,dual,"#00f");

    var prev_x = 0;
    var prev_y = 0;
    for(var x = 0; x<2.0; x+=.05){
        var y = x*x/2.0;
        add_line(dual,prev_x,prev_y,x,y);
        add_line(primal,prev_x,prev_y,x,y);
        prev_x = x;
        prev_y = y;
    }
});
