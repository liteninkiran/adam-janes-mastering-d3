const svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", 400)
    .attr("height", 250);

svg.append("circle")
    .attr("cx", 100)
    .attr("cy", 100)
    .attr("r", 70)
    .attr("fill", "red");
