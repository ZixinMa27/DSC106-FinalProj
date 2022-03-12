function final_proj(){
    var filePath="dataset/athletes.csv";
    var filePath2 ="dataset/medals_total.csv";
    var filePath3 = "dataset/entries_discipline.csv";
    question0(filePath);
    question1(filePath,filePath2);
    question2(filePath3);
    question3(filePath2);
    //question4(filePath);
    //question5(filePath);
    //question6(filePath);
}


//take a look for the dataset 
var question0= function(filePath){
    const file = d3.csv(filePath);
    file.then(function(data) {
        console.log(data);
    });       
}

var question1= function(filePath, filePath2){
    const file = d3.csv(filePath);
    const file2 = d3.csv(filePath2);
    
    file.then(function(data) {
        country_numAthletes = {};
        country_numMedals = {};
        for(let i = 0; i<data.length;i++){
            if(!(data[i].country in country_numAthletes)){
                country_numMedals[data[i].country] = 0;
                country_numAthletes[data[i].country] = 1;
            }
            else{
                country_numAthletes[data[i].country] += 1;
            }
        }
        file2.then(function(data2) {
            for(let j = 0; j<data2.length;j++){
                country_numMedals[data2[j].Country] = parseFloat(data2[j].Total);
            }

            athletes_medals =[]
            for(key in country_numAthletes){
                athletes_medals.push({Countries: key,Athletes: country_numAthletes[key], Medals: country_numMedals[key]})
            }
            

            var margin = {top: 30, right: 30, bottom: 70, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

            var tooltip=d3.select('#q1_plot').append("div").attr("style", "position: absolute")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

            // append the svg object to the body of the page
            var svg = d3.select("#q1_plot")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
            
            // X axis
            var x = d3.scaleLinear()
            .range([ 0, width])
            .domain([0,d3.max(athletes_medals, function(d) {return d.Athletes;})+10])
            
            svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))

           
            // Add Y axis
            var y = d3.scaleLinear()
            .domain([0, d3.max(athletes_medals, function(d) {return d.Medals;})+5])
            .range([ height, 0]);
            
            svg.append("g")
            .attr("class", "myYaxis")
            .call(d3.axisLeft(y));

            svg.append('g')
                .selectAll("circle")
                .data(athletes_medals)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.Athletes); } )
                .attr("cy", function (d) { return y(d.Medals); } )
                .attr("r", 3)
                .style("fill", "#69b3a2")
                .style("opacity",0.7)
                .on("mouseover", (e,d) =>{
                    tooltip.transition().duration(100).style("opacity",0.9);
                    tooltip.html("Country " + d.Countries + " has " + d.Athletes +" athletes participated and won "+ d.Medals+" medals").style("left",e.pageX+"px").style("top",e.pageY+"px");
                    
                })
                .on("mousemove", (e,d) =>{
                    
                    tooltip.transition().duration(100).style("opacity",0.9);
                    tooltip.html("Country " + d.Countries + " has " + d.Athletes +" athletes participated and won "+ d.Medals+" medals").style("left",e.pageX+"px").style("top",e.pageY+"px");
                    
                })
                .on("mouseout", (d) =>{
                    tooltip.transition().duration(100).style("opacity",0);
                } )

            // Add X axis label:
            svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width/2 + margin.left)
            .attr("y", height + margin.top + 20)
            .text("Number of atheletes");

            // Y axis label:
            svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top - height/2 + 80)
            .text("Number of Medals")
            
        });
        
        
        
    });       
}

var question2= function(filePath){
    const file = d3.csv(filePath, function(data, i){
        return i < 0 || i> 14 
        ? null
        : {
            "Discipline": data.Discipline,
            "F": data.Discipline,
            "M": data.M,
            "Total": parseFloat(data.Total)
        }
    });
    file.then(function(data){
        var margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
        
        var tooltip=d3.select('#q1_plot').append("div").attr("style", "position: absolute")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // append the svg object to the body of the page
        var svg = d3.select("#q2_plot")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        
        data.sort(function(b, a) {
             return a.Total - b.Total;
             });
        
        // X axis
        var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(data.map(function(d) { return d.Discipline; }))
        .padding(0.2);
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
            .attr("transform", "translate(5,0)rotate(-30)")
            .style("text-anchor", "end")
            .style("font", "10px times");

        // Add Y axis
        var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {return d.Total;})+20])
        .range([ height, 0]);
        svg.append("g")
        .call(d3.axisLeft(y));

        // Bars
        svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
            .attr("x", function(d) { return x(d.Discipline); })
            .attr("y", function(d) { return y(d.Total); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d.Total); })
            .attr("fill", "#69b3a2")
            .on("mouseover", (e,d) =>{
                tooltip.transition().duration(100).style("opacity",0.9);
                tooltip.html("Number of " + d.Total + " athletes participated in " + d.Discipline).style("left",e.pageX+"px").style("top",e.pageY+"px");
                
            })
            .on("mousemove", (e,d) =>{
                
                tooltip.transition().duration(100).style("opacity",0.9);
                tooltip.html("Number of " + d.Total + " athletes participated in " + d.Discipline).style("left",e.pageX+"px").style("top",e.pageY+"px");
                
            })
            .on("mouseout", (d) =>{
                tooltip.transition().duration(100).style("opacity",0);
            } )
    })
}

var question3= function(filePath){
    const file = d3.csv(filePath,function(data, i){
        return {
            "Order": data.Order,
            "Country": data.Country,
            "Gold": parseFloat(data.Gold),
            "Silver": parseFloat(data.Silver),
            "Bronze": parseFloat(data.Bronze),
            "Total": parseFloat(data.Total),
            "Order by Total": data["Order by Total"],
            "Country Code": data["Country Code"]
        }
        
    })
    file.then(function(data){
        //set the color 
        var colors = function(i){
            colorarray = ["red", "silver", "bronze"];
            return colorarray[i];
        }

        //stack secondary Key values
        //var stack = d3.stack().keys(["Gold", "Silver", "Bronze"]);
        //var series = stack(year_count);

        // plotting stacked bar chart

        var margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#q3_plot")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var subgroups = data.columns.slice(2,5)
        
        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(data, function(d){return(d.Country)})
        
        
        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .selectAll("text")
            .attr("transform", "translate(5,0)rotate(-30)")
            .style("text-anchor", "end")
            .style("font", "10px times");;
        
        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d){ 
                return d.Gold + d.Silver + d.Bronze+ 5;
            })])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));
        
        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#FFD700','#C0C0C0','#b08d57'])
        
        //stack the data? --> stack per subgroup
        var stackedData = d3.stack()
            .keys(subgroups)
            (data)
        
        
        var tooltip=d3.select('#q1_plot').append("div").attr("style", "position: absolute")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        
        

    
        
        // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function(d) { return color(d.key); })
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function(d) { return d; })
            .enter().append("rect")
                .attr("x", function(d) { return x(d.data.Country); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width",x.bandwidth())
                .on("mouseover", (e,d) =>{
                    tooltip.transition().duration(100).style("opacity",0.9);
                    tooltip.html(d[1] + " medals").style("left",e.pageX+"px").style("top",e.pageY+"px");
                    
                })
                .on("mousemove", (e,d) =>{
                    
                    tooltip.transition().duration(100).style("opacity",0.9);
                    tooltip.html(d[1] + " medals").style("left",e.pageX+"px").style("top",e.pageY+"px");
                    
                })
                .on("mouseout", (d) =>{
                    tooltip.transition().duration(100).style("opacity",0);
                } )

        
    })


}



