const urls = [pieChartDataUrl, barChartDataUrl];

Promise.all(urls.map(url => d3.json(url))).then(run);

function run(datasets) {
   d3PieChart(datasets[0], datasets[1]);
   d3BarChart(datasets[1]);
};