// Define SVG dimensions and properties
const margin = { top: 20, right: 10, bottom: 20, left: 20 },
  width = 350 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom,
  barPadding = 5,
  graph_misc = { ylabel: 4, xlabelH: 5, title: 9 };

// Default group
const group = "All";

// Get percentage values for a specific group
function get_percentage(group, datasetBarChart) {
  const result = [];
  for (instance in datasetBarChart) {
    if (datasetBarChart[instance].group == group) {
      result.push(datasetBarChart[instance]);
    }
  }
  return result;
}

function d3BarChart(datasetBarChart) {
  defaultBarChart = get_percentage(group, datasetBarChart);

  // Define X and Y scales
  const xScale = d3.scaleLinear()
    .domain([0, defaultBarChart.length])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(defaultBarChart, d => d.value)])
    .range([height, 0]);

  // Create SVG for the bar chart
  const bar = d3.select('#barChart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr('id', 'barChartPlot');

  // Add bar chart title
  bar.append('text')
    .attr('x', (width + margin.left + margin.right) / 2)
    .attr('y', graph_misc.title)
    .attr('class', 'title')
    .attr('text-anchor', 'middle')
    .text('Tenure group for churned customers');

  const visualization = bar.append('g')
    .attr("transform", `translate(${margin.left},${margin.top + graph_misc.ylabel})`);

  // Create bar chart rectangles
  visualization.selectAll("rect")
    .data(defaultBarChart)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("width", width / defaultBarChart.length - barPadding)
    .attr("y", d => yScale(d.value))
    .attr("height", d => height - yScale(d.value))
    .attr("fill", "#757077");

  // Add bar chart labels
  visualization.selectAll('text')
    .data(defaultBarChart)
    .enter()
    .append("text")
    .text(d => `${d.value}%`)
    .attr("text-anchor", "middle")
    .attr("x", (d, i) => (i * (width / defaultBarChart.length)) + ((width / defaultBarChart.length - barPadding) / 2))
    .attr("y", d => yScale(d.value) - graph_misc.ylabel)
    .attr("class", "yAxis");

  // Add X axis labels
  const xLabels = bar
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top + height + graph_misc.xlabelH})`);

xLabels.selectAll("text.xAxis")
    .data(defaultBarChart)
    .enter()
    .append("text")
    .text(d => d.category)
    .attr("text-anchor", "middle")
    .attr("x", (d, i) => (i * (width / defaultBarChart.length)) + ((width / defaultBarChart.length - barPadding) / 2))
    .attr("y", 15)
    .attr("class", "xAxis");
}