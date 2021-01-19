function init (){
    const selector = d3.select('#selDataset');

    d3.json('samples.json').then(data =>{
        console.log(data);
        let sampleNames = data.names;
        sampleNames.forEach(sample =>{
            selector
                .append('option')
                .text(sample )
                .property('value', sample);
        })
    })
}

function optionChanged(newSample){
    // console.log(newSample);
    buildMetadata(newSample);
    // buildCharts(newSample);
}
function buildMetadata(sample){
    d3.json('samples.json').then(data => {
        let metadata = data.metadata;
        let resultArray = metadata.filter(sampleObj => sampleObj.id === parseInt(sample));
        let result = resultArray[0];
        let PANEL = d3.select('#sample-metadata');
        console.log(typeof (result))

        PANEL.html('');
        Object.entries(result).forEach(([key,value]) =>{
            console.log(value)
            PANEL.append('h6').text(key.toUpperCase() + ': ' + value)
        })
    });
}

function buildCharts(){

}
init();
