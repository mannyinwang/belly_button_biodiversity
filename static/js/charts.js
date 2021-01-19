function init() {
  // Grab a reference to the dropdown select element
  const selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("../static/js/samples.json").then((data) => {
    let sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    console.log(data)
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
    let metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id === parseInt(sample));
    let result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");

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
    let samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let filteredSample = samples.filter(sampleObj => sampleObj.id === sample);
    //  5. Create a variable that holds the first sample in the array.
    let result = filteredSample[0];
    console.log(result)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIDs = result.otu_ids;
    let otuLabels = result.otu_labels;
    let sampleValues = result.sample_values;

    // Create a variable that holds the washing frequency.
    let washingFreq = data.metadata.filter(samples => samples.id === parseInt(sample))[0].wfreq
    console.log(washingFreq)


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.
    let yticks = otuIDs.slice(0,10).map(otu => `OTU ${otu}`).reverse()
    console.log(yticks)
    console.log(sampleValues.slice(0,10))


    // 8. Create the trace for the bar chart.
    let barData = [{
      x:sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
      orientation: 'h',
      type: 'bar'

    }

    ];
    // // 9. Create the layout for the bar chart.
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      font: {size:15},
      margin: {l:100, r:20, t:100,b:50}
    };

    let config = {
      responsive: true
    }
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout, config);

    // 1. Create the trace for the bubble chart.
    let bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color:otuIDs
      }
    }
    ];

    // 2. Create the layout for the bubble chart.
    let bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis:{
        title:{text:'OTU ID'}
      },
      font: {
        size:15
      }

    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // 4. Create the trace for the gauge chart.
    let gaugeData = [{
      value: washingFreq,
      type: 'indicator',
      title: {
        text:'Scrubs per Week'
      },
      mode: 'gauge+number',
      gauge: {
        axis:{
          range:[null,10]
        },
        bar: {color:'black'},
        steps: [
          {range: [0,2], color:'red'},
          {range: [2,4], color:'orange'},
          {range: [4,6], color:'yellow'},
          {range: [6,8], color:'lightgreen'},
          {range: [8,10], color:'green'}
        ]
      }
    }
    ];

    // 5. Create the layout for the gauge chart.
    let gaugeLayout = {
      title: 'Belly Button Washing Frequency',
      font: {
        size:15
      },
      width: 500,
      height: 400

    };

    // 6. Use Plotly to plot the gauge data and layout.\
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
}
