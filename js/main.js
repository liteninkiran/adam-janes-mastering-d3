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
const xLabel = g.append('text')
    .attr('class', 'x axis-label')
    .attr('x', WIDTH / 2)
    .attr('y', HEIGHT + (MARGIN.BOTTOM - 20))
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text('Month');

// Y label
const yLabel = g.append('text')
    .attr('class', 'y axis-label')
    .attr('x', - (HEIGHT / 2))
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)');

// X Scale
const x = d3.scaleBand()
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)

// Y Scale
const y = d3.scaleLinear()
    .range([HEIGHT, 0]);

const xAxisGroup = g.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${HEIGHT})`);

const yAxisGroup = g.append('g')
    .attr('class', 'y axis');

let flag = true;

d3.csv('data/revenues.csv').then(data => {
    data.forEach(d => {
        d.revenue = Number(d.revenue);
        d.profit = Number(d.profit);
    });
    d3.interval(() => update(data), 10000);
    update(data);
});

function update(data) {

    flag = !flag;

    const text = flag ? 'Profit (£)' : 'Revenue (£)';
    const value = flag ? 'profit' : 'revenue';

    x.domain(data.map(row => row.month));
    y.domain([0, d3.max(data, d => d[value])]);

    // X Axis
    const xAxisCall = d3.axisBottom(x);
    xAxisGroup.call(xAxisCall)
        .selectAll('text')
        .attr('y', '10')
        .attr('x', '0')
        .attr('text-anchor', 'centre');

    // Y Axis
    const yAxisCall = d3.axisLeft(y)
        .ticks(5)
        .tickFormat(d => '£' + d);

    yAxisGroup.call(yAxisCall);

    // JOIN - bind data
    const rects = g
        .selectAll('rect')
        .data(data);

    // EXIT - remove old elements
    rects.exit().remove();

    // UPDATE - update existing elements
    rects.attr('y', d => y(d[value]))
        .attr('x', d => x(d.month))
        .attr('width', x.bandwidth)
        .attr('height', d => HEIGHT - y(d[value]));

    // ENTER - add new elements
    rects.enter().append('rect')
        .attr('y', d => y(d[value]))
        .attr('x', d => x(d.month))
        .attr('width', x.bandwidth)
        .attr('height', d => HEIGHT - y(d[value]))
        .attr('fill', 'grey');

    yLabel.text(text);
}
