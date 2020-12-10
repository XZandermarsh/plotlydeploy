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
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
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
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    
    var selected_sample = samplesArray.filter(samplesArray => samplesArray.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var first_sample = selected_sample[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = selected_sample.map(samples => samples.otu_ids)[0];
    var otu_labels = selected_sample.map(samples => samples.otu_labels)[0];
    var sample_values = selected_sample.map(samples => samples.sample_values)[0];

    // 7. Create the yticks for the bar chart.
    var top10Samples = otu_ids.slice(0,10);
    var top10Values = sample_values.slice(0,10);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var result = resultArray[0];

    // 3. Create a variable that holds the washing frequency.
    var wfreq = result.wfreq;
    
    var yticks = top10Samples.map(element => "OTU " + element);

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: top10Values.reverse(),
      y: yticks.reverse(),
      type: "bar",
      orientation: "h"
    }
    //];
    var trace = [barData];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      orientation: 'h',
      height:450
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar-plot", trace, barLayout);

    // 1. Create the trace for the bubble chart.
    var trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {size:sample_values, color: otu_ids, colorscale:'Viridis'}
    };
    var bubbleData = [trace];
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 600,
      width: 1200,
      margin: {t:100}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("myDiv", bubbleData, bubbleLayout);
    
      // 4. Create the trace for the gauge chart.
      var gaugeData = [
        {
          domain: {x: [0,1], y: [0,1]},
          value: wfreq,
          title: { text:"<b>Belly Button Washing Frequency</b><br />Scrubs Per Week"},
          type: "indicator",
          mode: "gauge+number",
          gauge: { 
            bar: {color: "black"},
            axis: { range: [null, 10] }, 
            steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ],},
          marker: {line: {color: 'black'}}
        }
      ];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        width: 600, height: 450, margin: { t: 10, b: 10 }
      };
      
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
