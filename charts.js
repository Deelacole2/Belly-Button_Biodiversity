function init() {
  // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
        selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
}

// Demographics Panel 
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
    });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
        var samplesData = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
        var sampleResultArray = samplesData.filter(sampleObj => sampleObj.id === sample);
    //  5. Create a variable that holds the first sample in the array.
        var sampleResult = sampleResultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        var otu_ids = sampleResult.otu_ids;
        var otu_labels = sampleResult.otu_labels;
        var sample_values = sampleResult.sample_values;
        // console.log('ids'+ otu_ids, 'labels' + otu_labels, 'values' + sample_values)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(id => 'OTU '+id).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [
        {x: sample_values.slice(0,10).reverse(),
        y: yticks,
        type:'bar',
        text: otu_labels.slice(0,10).reverse(),
        orientation:'h', 
        marker: { color: '#17becf'}}
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: 'Top 10 Bacteria Cultures Found',
        yaxis: {title: 'Bacteria ID'},
        xaxis: {title: 'Sample Prevalence'}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout)

//     // 1. Create the trace for the bubble chart.
    var bubbleData = [
        {x: otu_ids,
        y: sample_values,
        type: 'scatter',
        mode: 'markers',
        marker: {
            color: otu_ids,
            colorscale: 'Electric',
            size: sample_values
            },
        text: otu_labels}
    
    ];

  // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        hovermode:"closest",
        title: "Bacteria Cultures Per Sample",
        xaxis : {title: "OTU ID"}, 
        showlegend: false,
        height: 600,
        width: 1000
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout)

//////////////////////////////////////////////////////////////////////////////
    // Create a variable that holds the samples array. 
    var metadata = data.metadata;
    // Create a variable that filters the samples for the object with the desired sample number.
    var gaugeArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    // Create a variable that holds the first sample in the array.
    // 2. Create a variable that holds the first sample in the metadata array.
    var gaugeResult = gaugeArray[0];
    // 3. Create a variable that holds the washing frequency.
    var washingFreq = gaugeResult.wfreq; 
// // 4. Create the trace for the gauge chart.
var gaugeData = [
	{
		domain: { x: [0, 1], y: [0, 1] },
		value: washingFreq,
		title: { text: "Belly Button Washing Frequency" },
		type: "indicator",
		mode: "gauge+number",
        gauge: {
            axis: { range: [null, 10] },
            bar: { color: "black"},
            steps: [
                {range: [0, 2], color: "red"},
                {range: [2, 4], color: "orange"},
                {range: [4, 6], color: "yellow"},
                {range: [6, 8], color: "limegreen"},
                {range: [8, 10], color: "green"}],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: 10
            }
          }
        }
      ];
// // 5. Create the layout for the gauge chart.
var gaugeLayout = { width: 600, height: 500 };

// // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout)
});
}


