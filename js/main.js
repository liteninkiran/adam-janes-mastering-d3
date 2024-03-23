d3.json('./data/buildings.json').then(data => {
    data.forEach(d => d.height = Number(d.height));
    const border = 'border: 1px solid lightgrey; border-radius: 20px;';
    const svg = d3.select('#chart-area')
        .append('svg')
        .attr('style', border)
        .attr('width', 500)
        .attr('height', 500);

    const rects = svg.selectAll('rect').data(data);

    rects.enter()
        .append('rect')
        .attr('x', (d, i) => (i * 80) + 50)
        .attr('y', 0)
        .attr('width', 50)
        .attr('height', d => d.height)
        .attr('fill', 'grey');

}).catch(error => {
    console.log(error);
});
