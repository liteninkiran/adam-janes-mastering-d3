d3.json('./data/ages.json').then(data => {
    console.log(data);
    data.forEach(d => d.age = Number(d.age));

    const svg = d3.select('#chart-area').append('svg')
        .attr('width', 400)
        .attr('height', 400);

    const circles = svg.selectAll('circle')
        .data(data);

    const colour = (d) => d.name === 'Jessica' ? 'blue' : 'red';

    circles.enter().append('circle')
        .attr('cx', (d, i) => (i * 50) + 50)
        .attr('cy', 250)
        .attr('r', (d) => 2 * d.age)
        .attr('fill', colour);
}).catch(error => {
    console.log(error);
});
