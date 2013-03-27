var radius = 10;
var height = 500;
var width = 500;
var mag_factor = 500;

function Point(x,y,primal,dual){
    var p = this;
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

    this.circle = this.primal.circle(x,y,radius);

    this.circle.drag(function(dx,dy){
            p.x = this.ox + dx;
            p.y = this.oy + dy;
            this.attr({cx: p.x, cy: p.y});
            p.line.remove();
            p.update_dual();
        },function(){
            this.ox = this.attr("cx");
            this.oy = this.attr("cy");
        }
    );

    // Sets the fill attribute of the circle to red (#f00)
    circle.attr("fill", "#f00");
    // Sets the stroke attribute of the circle to white
    circle.attr("stroke", "#fff");

    this.update_dual = function(){
        p.dual = dualize_point(p.get_x(),p.get_y(),"Geometric");
        p.line = p.primal.path("M " + String(p.dual['x1']*mag_factor) + " " + String(p.dual['y1']*mag_factor) + " L " + String(p.dual['x2']*mag_factor) + " " + String(p.dual['y2']*mag_factor));
    };

    this.update_dual();
}

function add_line(paper,x1,y1,x2,y2){
    x1 = x1+(width/2.0);
    y1 = y1+(height/2.0);
    x2 = x2+(width/2.0);
    y2 = y2+(height/2.0);
    paper.path("M " + String(x1) + " " + String(y1) + " L " + String(x2) + " " + String(y2));
}

$(function(){
    var primal = Raphael("dual", width, height);
    var dual = Raphael("primal", width, height);
    Point(250,250,primal,dual);
    Point(350,350,primal,dual);
    Point(150,150,primal,dual);
});
