// Add a gauge chart
// Build metadata
function buildMetadata(sample) {
    d3.json("data/samples.json").then(function(data) {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select('#sample-metadata');
        PANEL.html('');
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append('h6').text(`${key}: ${value}`);
        });
    });
}


// Build the gauge Chart function and chart
function buildGaugeChart(sample) {
    console.log("sample", sample);

    d3.json("data/samples.json").then(data => {

        var objs = data.metadata;
        var matchedSampleObj = objs.filter(sampleData =>
            sampleData["id"] === parseInt(sample));
        gaugeChart(matchedSampleObj[0]);
    });
}

function gaugeChart(data) {
    console.log("gaugeChart", data);

    if (data.wfreq === null) {
        data.wfreq = 0;
    }

    let degree = parseInt(data.wfreq) * 20;
    let degrees = 180 - degree;
    let radius = 0.5;
    let radians = degrees * Math.PI / 180;
    let x = radius * Math.cos(radians);
    let y = radius * Math.sin(radians);

    let mainPath = 'M -.0 -0.05 L .0 0.05 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    let path = mainPath.concat(pathX, space, pathY, pathEnd);

    let trace = [{
            type: 'scatter',
            x: [0],
            y: [0],
            marker: { size: 50, color: '2F6497' },
            showlegend: false,
            name: 'Washing frequency',
            text: data.wfreq,
            hoverinfo: 'text+name'
        },
        {
            values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
            rotation: 90,
            text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
            textinfo: 'text',
            textposition: 'inside',
            textfont: {
                size: 16,
            },
            marker: {
                colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce',
                    '#492970', '#f28f43', '#77a1e5', '#c42525', 'white'
                ]
            },
            labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1', ''],
            hoverinfo: 'text',
            hole: .5,
            type: 'pie',
            showlegend: false
        }
    ];

    let layout = {
        shapes: [{
            type: 'path',
            path: path,
            fillcolor: '#2F6497',
            line: {
                color: '#2F6497'
            }
        }],

        title: '<b>Belly Button Washing Frequency</b> <br> <b>Scrub Per Week</b>',
        height: 550,
        width: 550,
        xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        },
        yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        },
    };

    Plotly.newPlot('gauge', trace, layout, { responsive: true });

}

// Build the bar and bubble Charts
function buildCharts(sample) {
    d3.json("data/samples.json").then(function(data) {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        // Create a bubble chart that displays OTU IDs and Sample Values

        var bubbleLayout = {
            margin: { t: 0 },
            hovermode: 'closest',
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Value' }
        };
        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Jet'
            }
        }];
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);

        // Create a bar chart that displays OTU IDs and Sample Values
        var barData = [{
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h',
        }];
        var barLayout = {
            title: 'Top 10 OTUs',
            margin: { t: 30, l: 150 }
        };
        Plotly.newPlot('bar', barData, barLayout);
    });
}
// Initialize the dashboard
function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("data/samples.json").then((data) => {
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
        buildGaugeChart(firstSample)
    });
}
// Function for change of option
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
    buildGaugeChart(newSample);
}
// Initialize the dashboard
init();