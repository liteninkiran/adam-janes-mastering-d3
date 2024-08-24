const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;
const transform = `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`;
const svg = d3.select('#chart-area').append('svg')
    .attr('width', WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr('height', HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);
const g = svg.append('g').attr('transform', transform);

let time = 0;
let interval;
let formattedData;

const addTooltip = (d) => {
    const tips = [
        { label: 'Country', value: d.country, caps: true },
        { label: 'Continent', value: d.continent, caps: true },
        { label: 'Life Expectancy', value: d3.format('.2f')(d.life_exp), caps: false },
        { label: 'GDP Per Capita', value: d3.format('$,.0f')(d.income), caps: false },
        { label: 'Population', value: d3.format(',.0f')(d.population), caps: false },
    ];
    return tips.map(makeLine).join('');
}

const makeLine = ({ label, value, caps }) => `<strong>${label}</strong> <span style="color:red;${caps ? 'text-transform:uppercase;' : ''}">${value}</span><br>`;

// Tooltip
const tip = d3.tip().attr('class', 'd3-tip').html(addTooltip);
g.call(tip);

// Scales
const x = d3.scaleLog().base(10).range([0, WIDTH]).domain([142, 150000]);
const y = d3.scaleLinear().range([HEIGHT, 0]).domain([0, 90]);
const area = d3.scaleLinear().range([25 * Math.PI, 1500 * Math.PI]).domain([2000, 1400000000]);
const continentColour = d3.scaleOrdinal(d3.schemePastel1);

// Labels
const xLabel = g.append('text')
    .attr('y', HEIGHT + 50)
    .attr('x', WIDTH / 2)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text('GDP Per Capita ($)');
const yLabel = g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -40)
    .attr('x', -170)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text('Life Expectancy (Years)');
const timeLabel = g.append('text')
    .attr('y', HEIGHT - 10)
    .attr('x', WIDTH - 40)
    .attr('font-size', '40px')
    .attr('opacity', '0.4')
    .attr('text-anchor', 'middle')
    .text('1800');

// X Axis
const xAxisCall = d3.axisBottom(x).tickValues([400, 4000, 40000]).tickFormat(d3.format('$'));
g.append('g').attr('class', 'x axis').attr('transform', `translate(0, ${HEIGHT})`).call(xAxisCall);

// Y Axis
const yAxisCall = d3.axisLeft(y);
g.append('g').attr('class', 'y axis').call(yAxisCall);

// Legend
const legend = g.append('g').attr('transform', `translate(${WIDTH - 10}, ${HEIGHT - 125})`);
const continents = ['europe', 'asia', 'americas', 'africa'];

continents.forEach((continent, i) => {
    const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);

    legendRow.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', continentColour(continent));

    legendRow.append('text')
        .attr('x', -10)
        .attr('y', 10)
        .attr('text-anchor', 'end')
        .style('text-transform', 'capitalize')
        .text(continent);
});

d3.json('data/data.json').then(function (data) {
    // Clean data
    formattedData = data.map(year => {
        return year['countries'].filter(country => {
            const dataExists = (country.income && country.life_exp);
            return dataExists;
        }).map(country => {
            country.income = Number(country.income);
            country.life_exp = Number(country.life_exp);
            return country;
        });
    });

    // First run of the visualization
    update(formattedData[0]);
})

function update(data) {
    // Standard transition time for the visualization
    const t = d3.transition().duration(100);
    const continent = $('#continent-select').val();
    const filteredData = data.filter(d => continent === 'all' ? true : d.continent == continent);

    // JOIN new data with old elements
    const circles = g.selectAll('circle').data(filteredData, d => d.country);

    // EXIT old elements not present in new data
    circles.exit().remove();

    // ENTER new elements present in new data
    circles.enter().append('circle')
        .attr('fill', d => continentColour(d.continent))
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .merge(circles)
        .transition(t)
        .attr('cy', d => y(d.life_exp))
        .attr('cx', d => x(d.income))
        .attr('r', d => Math.sqrt(area(d.population) / Math.PI));

    // Update the time label
    timeLabel.text(String(time + 1800));

    $('#year')[0].innerHTML = String(time + 1800);
    $('#date-slider').slider('value', Number(time + 1800));
}

const step = () => {
    // At the end of our data, loop back
    time = (time < 214) ? time + 1 : 0;
    update(formattedData[time]);
}

$('#play-button').on('click', function () {
    const button = $(this);
    if (button.text() === 'Play') {
        button.text('Pause');
        interval = setInterval(step, 20);
    } else {
        button.text('Play');
        clearInterval(interval);
    }
});

$('#reset-button').on('click', () => {
    time = 0;
    update(formattedData[0]);
});

$('#continent-select').on('change', () => update(formattedData[time]));

$('#date-slider').slider({
    min: 1800,
    max: 2014,
    step: 1,
    slide: (event, ui) => {
        time = ui.value - 1800;
        update(formattedData[time]);
    }
});
