d3.json("./samples.json").then(function(data){

    //read json samples
    console.log(data)
    
    //assign a variable to an array of objects
    var otu_subjs = data.samples
    
    //use the map function to create an array of all the id names from the objects
    var otu_subj_ids = otu_subjs.map(data => data.id)
    //console.log(otu_subj_ids)

    //loop through the subject ids and append options for the dropdown menu
    otu_subj_ids.forEach(function(ids){
        d3.select("#selDataset").append("option").attr("value", ids).text(`${ids}`)
    })
    
    //initialize a baseline for demographic info
    d3.select("#sample-metadata").append('p').text('id:')
    d3.select("#sample-metadata").append('p').text('ethnicity:')
    d3.select("#sample-metadata").append('p').text('gender:')
    d3.select("#sample-metadata").append('p').text('age:')
    d3.select("#sample-metadata").append('p').text('location:')
    d3.select("#sample-metadata").append('p').text('bbtype:')
    d3.select("#sample-metadata").append('p').text('wfreqr:')
    //Event handlers
    d3.selectAll("#selDataset").on("change", updatePlotly);

    function updatePlotly() {
        var id_num = d3.select("#selDataset").property("value")
        //console.log(id_num)

        //Update Demographic Info

        //Create an array of metadata and samples, which are objects
        var metadata = data.metadata
        var samples = data.samples
        //console.log(samples)

        //The for loop goes through each object and checks the id of each object
        //if the id matches the user input, then it will store that object into 
        //a variable and update the table of demographic info
        for (var i =0; i < metadata.length; i++) {
            Object.entries(metadata[i]).forEach(([key, value]) => {
                if (id_num == value) {
                    var arr = metadata[i]
                    //console.log(arr)
                    
                    d3.select("#sample-metadata").select('p:nth-child(1)').text(`${Object.keys(arr)[0]}: ${arr.id}`)
                    d3.select("#sample-metadata").select('p:nth-child(2)').text(`${Object.keys(arr)[1]}: ${arr.ethnicity}`)
                    d3.select("#sample-metadata").select('p:nth-child(3)').text(`${Object.keys(arr)[2]}: ${arr.gender}`)
                    d3.select("#sample-metadata").select('p:nth-child(4)').text(`${Object.keys(arr)[3]}: ${arr.age}`)
                    d3.select("#sample-metadata").select('p:nth-child(5)').text(`${Object.keys(arr)[4]}: ${arr.location}`)
                    d3.select("#sample-metadata").select('p:nth-child(6)').text(`${Object.keys(arr)[5]}: ${arr.bbtype}`)
                    d3.select("#sample-metadata").select('p:nth-child(7)').text(`${Object.keys(arr)[6]}: ${arr.wfreq}`)

                    var trace3 = {
                        domain: { x: [0, 1], y: [0, 1] },
                        value: arr.wfreq,
                        title: {text: "Belly Button Washing Frequency"},
                        type: "indicator",
                        mode: "gauge+number",
                        gauge : {
                            axis: {range: [0,9]},
                            steps: [
                                {range: [0,1], color: "rgb(255,255,255)"},
                                {range: [1,2], color: "rgb(220,220,255)"}, 
                                {range: [2,3], color: "rgb(180,180,255)"},
                                {range: [4,5], color: "rgb(160,160,255)"},
                                {range: [6,7], color: "rgb(140,140,255)"},
                                {range: [7,8], color: "rgb(120,120,255)"},
                                {range: [8,9], color: "rgb(100,100,255)"},
                            ]
                        },
                        // threshold: {
                        //     line: {color: "purple", width: 6},
                        //     value: arr.wfreq
                        // }
                    
                    }
                    var data3 = [trace3]
                    var layout3 = { width: 600, height: 450, margin: { t: 0, b: 0 } };
                    Plotly.newPlot('gauge', data3, layout3);
                }
            })
        }
        
        for (var i =0; i < samples.length; i++) {
            Object.entries(samples[i]).forEach(([key, value]) => {

                //If the id number matches the user input, then we take object and
                //assign it to a variable so that we can work with each
                //key-value pair more conveniently

                if (id_num == value) {
                    var arr1 = samples[i]
                    var sample_values = arr1.sample_values
                    var otu_ids = arr1.otu_ids
                    var otu_labels = arr1.otu_labels

                    //console.log(sample_values)
                    //console.log(otu_ids)

                    //Filter through top 10 Bacteria Cultures and reorganize, 
                    //as well as adjust the string values in the OTU IDs array
                        
                    if (otu_ids.length >10) {
                        
                        var sample_values_filt = sample_values.slice(0,10)

                        var otu_ids_filt = otu_ids.slice(0,10)
                        otu_ids_filt = otu_ids_filt.map(String)
                        var new_OTU = []
                        otu_ids_filt.forEach(function(data){
                            new_OTU.push("OTU" + data)
                        })

                        new_OTU = new_OTU.reverse()
                        sample_values_filt = sample_values_filt.reverse()
                        otu_labels_filt = otu_labels.slice(0,10)
                        otu_labels_filt = otu_labels_filt.slice(0,10)
                    
                    //If there are no more than 10 entries, then we do not
                    //need to filter
                    
                    } else {

                        var sample_values_filt = sample_values

                        var otu_ids_filt = otu_ids.map(String)
                        var new_OTU = []
                        otu_ids_filt.forEach(function(data){
                            new_OTU.push("OTU " + data)
                        })

                        new_OTU = new_OTU.reverse()
                        sample_values_filt = sample_values_filt.reverse()
                        otu_labels_filt = otu_labels.slice(0,10)
                        otu_labels_filt = otu_labels_filt.slice(0,10)
                        
                    }

        
                    //Create traces and data for bar graph
                    var trace1 = {
                        x: sample_values_filt,
                        y: new_OTU,
                        type: "bar",
                        orientation: 'h'
                    }

                    var data = [trace1]

                    var layout = {
                        title: "Top 10 Bacteria Cultures Found",
                        xaxis: {title: "Number of Samples"},
                        yaxis: {title: "OTU ID"}
                    }
                    console.log(otu_ids_filt)
                    console.log(sample_values_filt)
                    Plotly.newPlot("bar",data,layout)
                    
                    //Create traces and data for bubble graph
                    var trace2 = {
                        x: otu_ids,
                        y: sample_values,
                        text: otu_labels,
                        mode: 'markers',
                        marker: {
                            color: otu_ids,
                            size: sample_values
                        }
                    

                    }

                    var data1 = [trace2]
                    var layout1 = {
                        title: "Bacterial Cultures per Sample",
                        xaxis: {title: "OTU ID"},
                        yaxis: {title: "Sample Numbers"}
                    }
                    Plotly.newPlot("bubble",data1,layout1)

                    

                }
            })
        }

        

    }




})

