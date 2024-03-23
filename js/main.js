// Constants
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 }
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

// X label
g.append('text')
    .attr('class', 'x axis-label')
    .attr('x', WIDTH / 2)
    .attr('y', HEIGHT + (MARGIN.BOTTOM - 20))
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text("The world's tallest buildings");

// Y label
g.append('text')
    .attr('class', 'y axis-label')
    .attr('x', - (HEIGHT / 2))
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Height (m)');

d3.json('data/buildings.json').then(data => {
    //  Convert 'height' to number
    data.forEach(d => d.height = Number(d.height));

    // Define X-Axis
    const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, WIDTH])
        .paddingInner(0.3)
        .paddingOuter(0.2);

    // Define Y-Axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.height)])
        .range([HEIGHT, 0]);

    const xAxisCall = d3.axisBottom(x);
    g.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${HEIGHT})`)
        .call(xAxisCall)
        .selectAll('text')
        .attr('y', '10')
        .attr('x', '-5')
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-40)');
    
    const yAxisCall = d3.axisLeft(y)
        .ticks(3)
        .tickFormat(d => d + 'm');
    g.append('g')
        .attr('class', 'y axis')
        .call(yAxisCall);

    // Add bars
    const rects = g
        .selectAll('rect')
        .data(data);

    // Add bars
    rects.enter().append('rect')
        .attr('y', d => y(d.height))
        .attr('x', (d) => x(d.name))
        .attr('width', x.bandwidth)
        .attr('height', d => HEIGHT - y(d.height))
        .attr('fill', 'grey');
});
