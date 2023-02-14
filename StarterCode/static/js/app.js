function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  const metadataURL = "/metadata/" +sample;
  d3.json(metadataURL).then((data) => {
 // Use d3 to select the panel with id of `#sample-metadata`
    metadatapanel = d3.select("#sample-metadata");

   // Use `.html("") to clear any existing metadata
   metadatapanel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Object.entries(data).forEach(([key, value]) => {
          metadatapanel.append("p").text(`${key}: ${value}`);

    });
    buildGauge(data.WFREQ);
  });

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  const sampleDataURL = "/samples/" +sample;
  d3.json(sampleDataURL).then((data)=> {
  // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    //Combine the 3 arrays in "data" into one in order to sort the slice

    results = [];
    for (var i = 0; i < data.otu_ids.length; i++){
      results.push({"otu_ids":data.otu_ids[i], "otu_labels": data.otu_labels[i], "sample_values":data.sample_values[i] });

    };
    results.sort((a,b) => b.sample_values - a.sample_values);
    results =results.slice(0,10);
    console.log(results);
    // Trace for the sample data
    var trace1 ={
      values:results.map(row => row.sample_values),
      labels:results.map(row => row.otu_ids),
      hovertext: results.map(row => row.otu_labels),
      hoverinfo: "hovertext",
      type:"pie"
      //orientation: "h"

    };
    var pieChart = [trace1];
    Plotly.newPlot("pie", pieChart);

    // @TODO: Build a Bubble Chart using the sample data

    var trace2 = {
      x:data.otu_ids,
      y:data.sample_values,
      type: "scatter",
      mode: "markers",
      marker:{
        size:data.sample_values,
        color: data.otu_ids
      },
      text: data.otu_labels

    };
    var bubbleChart = [trace2];
    Plotly.newPlot("bubble", bubbleChart);

        // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
// const washDataURL = "/wfreq/" + sample;
// d3.json(washDataURL).then(function(data){
// buildGauge(data.WFREQ);

// });

  });
  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
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

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
