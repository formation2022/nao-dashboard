function updateBarChart(group, color, datasetBarChart) {
    const currentBarChart = get_percentage(group, datasetBarChart);
  
    // Define chart scale, same as the default bar chart
    const xScale = d3.scaleLinear()
      .domain([0, currentBarChart.length])
      .range([0, width]);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(currentBarChart, d => d.value)])
      .range([height, 0]);
  
    const bar = d3.select('#barChart svg');
  
    // Update title for Barchart
    bar.selectAll("text.title")
      .attr("x", (width + margin.left + margin.right) / 2)
      .attr("y", graph_misc.title)
      .attr("class", "title")
      .attr("text-anchor", "middle")
      .text("Tenure group for churned customers " + group);
  
    const visualization = d3.select('barChartPlot')
      .datum(currentBarChart);
  
    visualization.selectAll('rect')
      .data(currentBarChart)
      .transition()
      .duration(750)
      .attr('x', (width + margin.left + margin.right) / 2)
      .attr('y', graph_misc.title)
      .attr('class', 'title')
      .attr('text-anchor', 'middle')
      .text('Tenure group for churned customers ' + group);
  
    const plot = d3.select('#barChartPlot')
      .datum(currentBarChart);
  
    // Update bars with new data
    plot.selectAll('rect')
      .data(currentBarChart)
      .transition()
      .duration(800)
      .attr('x', (d, i) => xScale(i))
      .attr('width', width / currentBarChart.length - barPadding)
      .attr('y', d => yScale(d.value))
      .attr("height", d => height - yScale(d.value))
      .attr("fill", color);
  
    // Update bar labels with new data
    plot.selectAll("text.yAxis")
      .data(currentBarChart)
      .transition()
      .duration(750)
      .attr("text-anchor", "middle")
      .attr("x", (d, i) => (i * (width / currentBarChart.length)) + ((width / currentBarChart.length - barPadding) / 2))
      .attr("y", d => yScale(d.value) - graph_misc.ylabel)
      .text(d => d.value + '%')
      .attr("class", "yAxis");
  };