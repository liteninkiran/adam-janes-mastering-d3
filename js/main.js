const border = 'border: 1px solid lightgrey; border-radius: 20px;';
const svg = d3.select('#chart-area')
    .append('svg')
    .attr('style', border)
    .attr('width', 500)
    .attr('height', 400);

svg.append('circle')
    .attr('cx', 100)
    .attr('cy', 100)
    .attr('r', 70)
    .attr('fill', 'red');

const y = 100;
const x = 300;
const length = 100;

svg.append('line')
    .attr('x1', x)
    .attr('y1', y)
    .attr('x2', x + length)
    .attr('y2', y)
    .attr('stroke', 'blue')
    .attr('stroke-width', 5);

svg.append('rect')
    .attr('x', 50)
    .attr('y', 230)
    .attr('width', 100)
    .attr('height', 100)
    .attr('fill', 'green');

svg.append('ellipse')
    .attr('cx', 350)
    .attr('cy', 280)
    .attr('rx', 100)
    .attr('ry', 50)
    .attr('fill', 'red');
