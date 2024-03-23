// Constants
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;
const BORDER = 'border: 1px solid lightgrey; border-radius: 5px;';
const TRANSFORM = `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`;

// SVG
const svg = d3.select('#chart-area')
    .append('svg')
    .attr('style', BORDER)
    .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

// Group
const g = svg.append('g')
    .attr('transform', TRANSFORM);

d3.json('data/buildings.json').then(data => {
    //  Convert 'height' to number
    data.forEach(d => d.height = Number(d.height));

    // Define X-Axis
    const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, WIDTH])
        .paddingInner(0.3)
        .paddingOuter(0.2)

    // Define Y-Axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.height)])
        .range([0, HEIGHT])

    // Add bars
    const rects = g
        .selectAll('rect')
        .data(data);

    // Add bars
    rects.enter().append('rect')
        .attr('y', 0)
        .attr('x', (d) => x(d.name))
        .attr('width', x.bandwidth)
        .attr('height', d => y(d.height))
        .attr('fill', 'grey');
});
