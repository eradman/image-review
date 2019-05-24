/*
 * 2019 Eric Radman <ericshane@eradman.com>
 */

var margin = 40,
    marginT = 80,
    imgWidth = 1680, imgHeight = 1230,
    viewWidth = 840, viewHeight = 615,
    translate0 = [margin/2, margin/2], scale0 = 0.5;

function baseName(str)
{
   var base = new String(str).substring(str.lastIndexOf('/') + 1); 
    if(base.lastIndexOf(".") != -1)
        base = base.substring(0, base.lastIndexOf("."));
   return base;
}

function myDelta() {
   return -d3.event.deltaY / 600;
}

function round(n) {
   return parseFloat(n).toFixed(2);
}

function toggle_visibility(e) {
  if(e.attr("visibility") == "visible")
    e.attr("visibility", "hidden");
  else
    e.attr("visibility", "visible");
}

function newFrame(img, x, y, k) {
  function zoomAction() {
    view.attr("transform", d3.event.transform);
    var status_text =
      round(d3.event.transform.x) + ", " +
      round(d3.event.transform.y) + ", " +
      round(d3.event.transform.k);
    status.text(status_text);
  }

  var zoom = d3.zoom()
      .scaleExtent([1, 1.5])
      .wheelDelta(myDelta)
      .on("zoom", zoomAction);

  var svg = d3.select("body").append("svg")
      .attr("width",  marginT + viewWidth + "px")
      .attr("height", marginT + viewHeight + "px");

  var view = svg.append("g")
      .attr("transform", "translate(" + translate0 + ")scale(" + scale0 + ")")
      .append("g");

  view.append("image")
      .attr("x",  margin + "px")
      .attr("y",  margin + "px")
      .attr("width",  imgWidth + "px")
      .attr("height", imgHeight + "px")
      .attr("xlink:href", img);

  // left
  svg.append("rect")
      .attr("x",  0 + "px")
      .attr("y",  margin + "px")
      .attr("width",  margin + "px")
      .attr("height", viewHeight + "px")
      .attr("class", "side");
  // right
  svg.append("rect")
      .attr("x",  viewWidth + margin + "px")
      .attr("y",  margin + "px")
      .attr("width",  margin + "px")
      .attr("height", viewHeight + "px")
      .attr("class", "side");
  // top
  svg.append("rect")
      .attr("x",  0 + "px")
      .attr("y",  0 + "px")
      .attr("width",  viewWidth + marginT + "px")
      .attr("height", margin + "px")
      .attr("class", "side");
  // bottom
  svg.append("rect")
      .attr("x",  0 + "px")
      .attr("y",  viewHeight + margin + "px")
      .attr("width",  viewWidth + marginT + "px")
      .attr("height", margin + "px")
      .attr("class", "side");

  svg.append("text")
      .attr("x",  (margin + 30) + "px")
      .attr("y",  viewHeight + (margin * 1.6) + "px")
      .attr("class", "filename")
      .text(baseName(img));

  link = svg.append("a")
      .attr("xlink:href", img)
      .attr("xlink:title", "Download image")
      .attr("download", img);

  link.append("text")
      .attr("x", margin + "px")
      .attr("y",  viewHeight + (margin * 1.6) + "px")
      .attr("class", "filename button")
      .text("⤓");

  var control_area = svg.append("g")
      .attr("visibility", "hidden");

  var pz_control = control_area.append("rect")
      .attr("x", "10px")
      .attr("y", "10px")
      .attr("width",  (viewWidth / 2.5) + "px")
      .attr("height", (viewHeight / 2.5) + "px")
      .attr("class", "area")

  var status = control_area.append("text")
      .attr("x",  (viewWidth / 5) + "px")
      .attr("y",  "25px")
      .attr("id",  "transform")

  var edit_button = svg.append("text")
      .attr("x",  "10px")
      .attr("y",  "25px")
      .attr("class", "button")
      .text("⇲")
      .on("click", function(d,i){  toggle_visibility(control_area) } );

  var t = d3.zoomIdentity.translate(x, y).scale(k);

  zoom.transform(view, t);       // Resize image
  zoom.transform(pz_control, t); // Keep D3 state on control area

  if (k < 1.0) k = 1.0;
  pz_control.call(zoom);
  pz_control.on("dblclick.zoom", null);
}

window.onload = function (e) {
    var evt = e || window.event, imgs, i;
    if (evt.preventDefault) {
        imgs = document.getElementsByTagName('image');
        for (i = 0; i < imgs.length; i++) {
            imgs[i].onmousedown = function (e) { e.preventDefault(); }
        }
    }
};
