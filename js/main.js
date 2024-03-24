// Constants
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 70 }
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
    .text('Month');

// Y label
g.append('text')
    .attr('class', 'y axis-label')
    .attr('x', - (HEIGHT / 2))
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Revenue (£)');

d3.csv('data/revenues.csv').then(data => {

    console.log(data);

    // Convert strings to numbers
    data.forEach(d => d.revenue = Number(d.revenue));
    data.forEach(d => d.profit = Number(d.profit));

    // X Scale
    const x = d3.scaleBand()
        .domain(data.map(row => row.month))
        .range([0, WIDTH])
        .paddingInner(0.3)
        .paddingOuter(0.2)

    // X Axis
    const xAxisCall = d3.axisBottom(x);
    g.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${HEIGHT})`)
        .call(xAxisCall)
        .selectAll('text')
        .attr('y', '10')
        .attr('x', '0')
        .attr('text-anchor', 'centre');

    // Y Scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.revenue)])
        .range([HEIGHT, 0]);

    // Y Axis
    const yAxisCall = d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => '£' + d);
    g.append('g')
        .attr('class', 'y axis')
        .call(yAxisCall);

    // Add bars
    const rects = g
        .selectAll('rect')
        .data(data);

    // Add bars
    rects.enter().append('rect')
        .attr('y', d => y(d.revenue))
        .attr('x', d => x(d.month))
        .attr('width', x.bandwidth)
        .attr('height', d => HEIGHT - y(d.revenue))
        .attr('fill', 'grey');
});
