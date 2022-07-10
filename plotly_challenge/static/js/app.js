// Belly button biodiversity 
// Build metadata and plot data for a Belly Button Biodiversity Project

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
    });
}
// Function for change of option
function optionChanged(newSample) {
    buildCharts(newSample);
    buildMetadata(newSample);
}
// Initialize the dashboard
init();