d3.json('./data/buildings.json').then(data => {
    data.forEach(d => d.height = Number(d.height));
    const border = 'border: 1px solid lightgrey; border-radius: 20px;';
    const svg = d3.select('#chart-area')
        .append('svg')
        .attr('style', border)
        .attr('width', 400)
        .attr('height', 400);

    const buffer = 50;
    const maxValue = 828;
    const rects = svg.selectAll('rect').data(data);
    const y = d3.scaleLinear()
        .domain([0, maxValue + buffer])
        .range([0, 400]);

    rects.enter()
        .append('rect')
        .attr('x', (d, i) => (i * 60) + 20)
        .attr('y', 0)
        .attr('width', 40)
        .attr('height', d => y(d.height))
        .attr('fill', 'grey');

}).catch(error => {
    console.log(error);
});
