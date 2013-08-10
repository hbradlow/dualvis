var ColorTileUID = 0;
function ColorTile(id,color,active){
    var tile = this;
    this.color = color;
    this.id = id;
    this.uid = ColorTileUID;
    var content = "<div class='span1'><div id='color_tile_" + this.uid + "' class='color_box' style='background-color:" + color + "'><div class='color_box_inner'></div></div></div>";

    $(id).append(content);

    if(active)
        $("#color_tile_"+tile.uid).attr("class","color_box color_box_active");

    $("#color_tile_"+this.uid).hover(function(){
        $("#color_tile_"+tile.uid+ " .color_box_inner").css("background-color","rgba(255,255,255,.6)");
    }, function(){
        $("#color_tile_"+tile.uid+ " .color_box_inner").css("background-color","");
    });

    $("#color_tile_"+this.uid).click(function(){
        activeColor = tile.color;
        var a = $(".color_box_active");
        a.attr("class","");
        a.attr("class","color_box");
        $("#color_tile_"+tile.uid).attr("class","color_box color_box_active");
    });

    ColorTileUID += 1;
}
