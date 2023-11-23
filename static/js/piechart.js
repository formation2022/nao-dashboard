function d3PieChart(dataset, datasetBarChart) {
    // Define SVG dimensions and properties
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 350 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;
    const outerRadius = Math.min(width, height) / 2;
    const innerRadius = outerRadius * 0.5;
    const color = d3.scaleOrdinal(d3.schemeAccent); // color scheme
  
    // Create SVG for the pie chart
    const visualization = d3.select('#pieChart')
      .append('svg')
      .data([dataset])
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${outerRadius},${outerRadius})`);
  
    // Prepare data for the pie chart
    const data = d3.pie()
      .sort(null)
      .value(d => d.value)(dataset);
  
    // Create arc generators for the pie chart
    const arc = d3.arc()
      .outerRadius(outerRadius)
      .innerRadius(0);
  
    const innerArc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);
  
    // Create pie chart slices
    const arcs = visualization.selectAll('g.slice')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'slice')
      // Update bar chart when a pie chart slice is clicked
      .on('click', (d, i) => updateBarChart(d.data.category, color(i), datasetBarChart));
  
    // Add path elements for slices
    arcs.append('path')
      .attr('fill', (d, i) => color(i))
      .attr('d', arc)
      .append('title')
      .text(d => `${d.data.category}: ${d.data.value}%`);
  
    // Animate pie chart slices
    d3.selectAll('g.slice')
      .selectAll('path')
      .transition()
      .duration(200)
      .delay(5)
      .attr('d', innerArc);
  
    // Add labels for slices
    arcs.filter(d => d.endAngle - d.startAngle > 0.1)
      .append('text')
      .attr('dy', '0.20em')
      .attr('text-anchor', 'middle')
      .attr('transform', d => `translate(${innerArc.centroid(d)})`)
      .text(d => d.data.category);
  
    // Add title to the pie chart
    visualization.append('text')
      .attr('dy', '.20em')
      .attr('text-anchor', 'middle')
      .text('churned customers')
      .attr('class', 'title');
  }