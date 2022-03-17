function final_proj() {
    var filePath = "dataset/athletes.csv";
    var filePath2 = "dataset/medals_total.csv";
    var filePath3 = "dataset/entries_discipline.csv";
    var filePath4 = "dataset/medals.csv"
    question0(filePath);
    question1(filePath, filePath2);
    question2(filePath3);
    question3(filePath2);
    question4(filePath4, filePath2);
    question5(filePath);
    question6(filePath2);
}

//take a look for the dataset 
var question0 = function (filePath) {
    const file = d3.csv(filePath);
    file.then(function (data) {
        console.log(data);
    });
}

var question1 = function (filePath, filePath2) {
    const file = d3.csv(filePath);
    const file2 = d3.csv(filePath2);

    file.then(function (data) {
        country_numAthletes = {};
        country_numMedals = {};
        for (let i = 0; i < data.length; i++) {
            if (!(data[i].country in country_numAthletes)) {
                country_numMedals[data[i].country] = 0;
                country_numAthletes[data[i].country] = 1;
            }
            else {
                country_numAthletes[data[i].country] += 1;
            }
        }
        file2.then(function (data2) {
            for (let j = 0; j < data2.length; j++) {
                country_numMedals[data2[j].Country] = parseFloat(data2[j].Total);
            }

            athletes_medals = []
            for (key in country_numAthletes) {
                athletes_medals.push({ Countries: key, Athletes: country_numAthletes[key], Medals: country_numMedals[key] })
            }


            var margin = { top: 30, right: 30, bottom: 70, left: 60 },
                width = 460 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

            // add tooltip  
            var tooltip = d3.select('#q1_plot').append("div").attr("style", "position: absolute")
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
                .range([0, width])
                .domain([0, d3.max(athletes_medals, function (d) { return d.Athletes; }) + 10])

            var xAxis = svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .attr('id', 'xAxis')

            

            // Add brush + zoom feature to this plot.
            var brush = d3.brush().extent([[0,0], [width, height]]).on('end', function(e, d){
                // See if selection occured.
                if (!e.selection) {
                    if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
                    // Set old original x and y axes domains
                    x.domain(d3.extent(athletes_medals, function (d) { return d.Athletes; })).nice();
                    y.domain(d3.extent(athletes_medals, function (d) { return d.Medals; })).nice();
                } else {
                    // Update x and y axes domain
                    x.domain([e.selection[0][0], e.selection[1][0]].map(x.invert, x));
                    y.domain([e.selection[1][1], e.selection[0][1]].map(y.invert, y));
                    scatter.select(".brush").call(brush.move, null);
                }
                // Update axis
                xAxis.transition().duration(1000).call(d3.axisBottom(x))
                yAxis.transition().duration(1000).call(d3.axisLeft(y))
                // Update scatter plot.
                scatter.selectAll('.dots').transition().duration(1000)
                .attr("cx", function (d) { return x(d.Athletes); })
                .attr("cy", function (d) { return y(d.Medals); })
            }), idleTimeout, idleDelay = 350;
            // Add clipping for brush.
            var clip = svg.append("defs").append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("width", width )
                .attr("height", height )
                .attr("x", 0) 
                .attr("y", 0); 

            // Define scatter plot specifically, use clips for brush.
            var scatter = svg.append("g")
             .attr("id", "scatterplot")
             .attr("clip-path", "url(#clip)");

            // Append brush to scatterplot.
            scatter.append("g")
             .attr("class", "brush")
             .call(brush);

            // Brush idle handler
            function idled() {
                idleTimeout = null;
            }

            // Add title
            svg.append("text")
                .attr("x", (width / 2))             
                .attr("y", 0 - (margin.top / 2))
                .attr("text-anchor", "middle")  
                .style("font-size", "16px") 
                .style("text-decoration", "underline")  
                .text("Number of Athletes vs Number of Medals");
                
            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, d3.max(athletes_medals, function (d) { return d.Medals; }) + 5])
                .range([height, 0]);

            var yAxis = svg.append("g")
                .attr("class", "myYaxis")
                .call(d3.axisLeft(y))
                .attr('id', 'yAxis');

            scatter.append('g')
                .selectAll("circle")
                .data(athletes_medals)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x(d.Athletes); })
                .attr("cy", function (d) { return y(d.Medals); })
                .attr("r", 3)
                .attr('class', 'dots')
                .style("fill", "#69b3a2")
                .style("opacity", 0.7)
                .on("mouseover", (e, d) => {
                    tooltip.transition().duration(100).style("opacity", 0.9);
                    tooltip.html(d.Countries + " had " + d.Athletes + " athletes that participated and won " + d.Medals + " medals").style("left", e.pageX + "px").style("top", e.pageY + "px");

                })
                .on("mousemove", (e, d) => {

                    tooltip.transition().duration(100).style("opacity", 0.9);
                    tooltip.html(d.Countries + " had " + d.Athletes + " athletes that participated and won " + d.Medals + " medals").style("left", e.pageX + "px").style("top", e.pageY + "px");

                })
                .on("mouseout", (d) => {
                    tooltip.transition().duration(0).style("opacity", 0);
                    tooltip.style('left', '1000px').style('right', '1000px')
                })

            // Add X axis label:
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width / 2 + margin.left)
                .attr("y", height + margin.top + 20)
                .text("Number of atheletes");

            // Y axis label:
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 20)
                .attr("x", -margin.top - height / 2 + 80)
                .text("Number of Medals")

        });

    


    });
}

var question2 = function (filePath) {
    const file = d3.csv(filePath, function (data, i) {
        return i < 0 || i > 14
            ? null
            : {
                "Discipline": data.Discipline,
                "F": data.F,
                "M": data.M,
                "Total": parseFloat(data.Total)
            }
    });
    file.then(function (data) {
        var margin = { top: 30, right: 30, bottom: 70, left: 60 },
            width = 1000 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var tooltip = d3.select('#q1_plot').append("div").attr("style", "position: absolute")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
        
        
        data.sort(function(a, b){
            
                return b.Total - a.Total
        })
        var myColor = d3.scaleOrdinal().domain(data).range(d3.schemeSet3)
    
    
        // append the svg
        var svg = d3.select("#q2_plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add title
        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Number of Athletes in Each Sport");

        // X axis
        var x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(function (d) { return d.Discipline; }))
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
            .domain([0, d3.max(data, function (d) { return d.Total; }) + 20])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Bars
        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return x(d.Discipline); })
            .attr("y", function (d) { return y(d.Total); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(0); }) 
            .attr("y", function(d) { return y(0); })
            //.attr("height", function (d) {return height - y(d.Total); })
            .attr("fill", "#69b3a2")
            .on("mouseover", (e, d) => {
                tooltip.transition().duration(100).style("opacity", 0.9);
                tooltip.html(d.Total + " athletes participated in " + d.Discipline).style("left", e.pageX + "px").style("top", e.pageY + "px");
            })
            .on("mousemove", (e, d) => {
                tooltip.transition().duration(100).style("opacity", 0.9);
                tooltip.html(d.Total + " athletes participated in " + d.Discipline).style("left", e.pageX + "px").style("top", e.pageY + "px");
            })
            .on("mouseout", (d) => {
                tooltip.transition().duration(100).style("opacity", 0);
            })
            .attr("fill", function (d){ return myColor(d) });


        //add zoom-in and -out capability
        var zoomBar = d3.zoom()
                    .on("zoom", function(e, d){
                        svg.attr("transform", e.transform)
                    })
        svg.call(zoomBar) 
        
        svg.selectAll("rect")
            .transition()
            .duration(800)
            .attr("y", function(d) { return y(d.Total); })
            .attr("height", function(d) { return height - y(d.Total); })
            .delay(function(d,i){ return(i*100)})

            // Add X axis label:
        svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width / 2 + margin.left)
                .attr("y", height + margin.top + 35)
                .text("Discipline");

            // Y axis label:
        svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 10)
                .attr("x", -margin.top - height / 2 + 80)
                .text("Number of Athletes")

    })
}

var question3 = function (filePath) {
    const file = d3.csv(filePath, function (data, i) {
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
    file.then(function (data) {
        //set the color 
        var colors = function (i) {
            colorarray = ["red", "silver", "bronze"];
            return colorarray[i];
        }
        
        var margin = { top: 30, right: 30, bottom: 70, left: 60 },
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

        var subgroups = data.columns.slice(2, 5)

        // List of groups
        var groups = d3.map(data, function (d) { return (d.Country) })

        // Add title
        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Number of Bronze, Silver, Gold Medals Per Country");

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
            .domain([0, d3.max(data, function (d) {
                return d.Gold + d.Silver + d.Bronze + 5;
            })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#FFD700', '#C0C0C0', '#b08d57'])

        //stack per subgroup
        var stackedData = d3.stack()
            .keys(subgroups)
            (data)


        var tooltip = d3.select('#q1_plot').append("div").attr("style", "position: absolute")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        svg.append("g")
            .selectAll("g")
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function (d) { return color(d.key); })
            .selectAll("rect")
            .data(function (d) { return d; })
            .enter().append("rect")
            .attr("x", function (d) { return x(d.data.Country); })
            .attr("y", function (d) { return y(d[1]); })
            .attr("height", function (d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth())
            .on("mouseover", (e, d) => {
                tooltip.transition().duration(100).style("opacity", 0.9);
                tooltip.html(d[1] + " medals").style("left", e.pageX + "px").style("top", e.pageY + "px");

            })
            .on("mousemove", (e, d) => {
                tooltip.transition().duration(100).style("opacity", 0.9);
                tooltip.html(d[1] + " medals").style("left", e.pageX + "px").style("top", e.pageY + "px");
            })
            .on("mouseout", (d) => {
                tooltip.transition().duration(100).style("opacity", 0);
            })

        var legend = d3.legendColor()
        .scale(color);

        svg.append("g")
        .attr("transform", "translate(750,45)")
        .call(legend);

        svg.append("text")
                .attr("text-anchor", "end")
                .attr("x", width / 2 + margin.left)
                .attr("y", height + margin.top + 35)
                .text("Country");

            // Y axis label:
        svg.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 10)
                .attr("x", -margin.top - height / 2 + 80)
                .text("Number of Medals Won")
        


    })


}

var question4 = function (filePath, filePath2) {
    var countries = [];
    var medals_total = d3.csv(filePath2, function (d) {
        if (d.Order <= 10) { return d }
    })
    medals_total.then(function (data) {
        countries = d3.map(data, d => d.Country)
    })
    var rowConverter = function (d) {
        if (countries.indexOf(d.country) > -1) {
            return {
                country: d.country,
                date: d3.timeParse("%Y-%m-%d")(d.medal_date.split(' ')[0])
            }
        }
    }

    var medals = d3.csv(filePath, rowConverter)
    medals.then(function (data) {
        const unique = (value, index, self) => {
            return self.indexOf(value) === index
        }
        var group = d3.rollup(data, v => v.length, d => d.date, d => d.country)
        var grouped_data = [...group].flatMap(([k1, v1]) => [...v1].map(([k2, v2]) => ({ date: k1, country: k2, count: v2 })))

        var dates = Array.from(d3.map(grouped_data, d => d.date).values()).filter(unique)

        var new_data = []
        for (var i = 0; i < dates.length; i++) {
            var temp = {}
            temp['date'] = dates[i]
            var values = group.get(dates[i])
            for (const [key, value] of values.entries()) {
                temp[key] = value
            }
            new_data.push(temp)
        }
        new_data.forEach(function (d) {
            var keys = Object.keys(d)
            for (var i = 0; i < countries.length; i++) {
                if (!keys.includes(countries[i])) {
                    d[countries[i]] = 0
                }
            }
            return d
        })

        var height = 800;
        var width = 1100;
        var margin = 50;

        var svg = d3.select("#q4_plot").append("svg").attr("width", width).attr("height", height);
        //svg.append('text').attr('text-anchor', 'middle').text('Streamgraph of medal counts for top 10 countries')
        // Add title
        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 50)
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Medal Counts Per Day Per Country");

        var tooltip = d3.select("#q4_plot")
            .append("div")
            .attr("class", "tooltip")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        var x = d3.scaleTime().domain(d3.extent(new_data, d => d.date)).range([margin, width - margin])
        var y = d3.scaleLinear().domain([0, d3.max([...d3.rollup(grouped_data, v => d3.sum(v, d => d.count), d => d.date).values()]) + 10]).range([height - margin, margin])

        var x_axis = d3.axisBottom(x).ticks(dates.length)
        var y_axis = d3.axisLeft(y)

        svg.append('g').attr('transform', `translate(${margin},0)`).call(y_axis).append("text").attr('text-anchor', "end");
        svg.append('g').attr('transform', `translate(0,${height - margin})`).call(x_axis).selectAll("text").attr("text-anchor", "end").attr("transform", "rotate(-45)");

        var color = d3.scaleOrdinal(d3.schemeSpectral[10]).domain(countries)

        var stack = d3.stack().keys(countries)(new_data)
        svg.selectAll('.layer').data(stack).enter().append('path').attr("class", "layer").style('fill', d => color(d.key))
            .attr("d", d3.area()
                .x(d => x(d.data.date))
                .y0(d => y(d[0]))
                .y1(d => y(d[1]))
                .curve(d3.curveBasis))

        svg.selectAll('.layer')
            .attr("opacity", 1)
            .on("mouseover", function (e, d) {
                i = d.index
                svg.selectAll(".layer").transition()
                    .duration(200)
                    .attr("opacity", function (d, j) {
                        return j != i ? 0.6 : 1;
                    })
            })
            .on("mousemove", function (e, d) {
                var currentColor = d3.schemeSpectral[10][d.index]
                d3.select(this)
                    .classed("hover", true)
                    .attr("stroke", d3.rgb(currentColor).darker(1).formatHex())
                    .attr("stroke-width", "1px")
                tooltip.html("<div class='key'><div style='background:" + currentColor + "' class='swatch'>&nbsp;</div>" + d.key + "</div>")
                    .style("left", e.pageX + 10 + "px").style("top", e.pageY + 10 + "px")
                    .style("visibility", "visible")
            })
            .on("mouseout", function (d, i) {
                svg.selectAll(".layer")
                    .transition()
                    .duration(250)
                    .attr("opacity", "1");
                d3.select(this)
                    .classed("hover", false)
                    .attr("stroke-width", "0px")
                tooltip.style("visibility", "hidden");
            })

        var legend = d3.legendColor()
                .scale(color);
    
        svg.append("g")
        .attr("transform", "translate(750,45)")
        .call(legend);

        svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .text("Day");

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", (height / 2) - 380)
        .attr("x", -275)
        .text("Number of Medals Won")

    })
}

var question5 = function (filePath) {
    function getAge(date) {
        var today = new Date();
        var birthDate = new Date(date);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    var rowConverter = function (d) {
        return {
            gender: d.gender,
            age: getAge(d.birth_date)
        }
    }

    var athletes = d3.csv(filePath, rowConverter)

    athletes.then(function (data) {
        var height = 600;
        var width = 600;
        var margin = 50;

        var svg = d3.select("#q5_plot").append("svg").attr("width", width).attr("height", height);

        var draw_box = function (data) {
            var ages = d3.map(data, d => d.age).sort(d3.ascending)
            var q1 = d3.quantile(ages, .25)
            var median = d3.quantile(ages, .5)
            var q3 = d3.quantile(ages, .75)
            var IQR = q3 - q1
            var min = q1 - 1.5 * IQR
            var max = q1 + 1.5 * IQR
            // var x = d3.scaleTime().domain().range([margin, width-margin])
            var y = d3.scaleLinear().domain([min - 5, max + 5]).range([height - margin, margin])

            // Add title
            svg.append("text")
                .attr("x", (width / 2))             
                .attr("y", 50)
                .attr("text-anchor", "middle")  
                .style("font-size", "16px") 
                .style("text-decoration", "underline")  
                .text("Distribution of Ages of Athletes");

            // var x_axis = d3.axisBottom(x).ticks(dates.length)
            var y_axis = d3.axisLeft(y)
            svg.append('g').attr('transform', `translate(${margin},0)`).call(y_axis).append("text").attr('text-anchor', "end");

            var lineCenter = 300
            var lineWidth = 50
            svg.append('line').attr('x1', lineCenter).attr('x2', lineCenter).attr("y1", y(min)).attr("y2", y(max)).attr("stroke", "black")
            svg.append("rect")
                .attr("x", lineCenter - lineWidth / 2)
                .attr("y", y(q3))
                .attr("height", (y(q1) - y(q3)))
                .attr("width", lineWidth)
                .attr("stroke", "black")
                .style("fill", "#69b3a2")
            svg.selectAll("lines")
                .data([min, median, max])
                .enter()
                .append("line")
                .attr("x1", lineCenter - lineWidth / 2)
                .attr("x2", lineCenter + lineWidth / 2)
                .attr("y1", function (d) { return (y(d)) })
                .attr("y2", function (d) { return (y(d)) })
                .attr("stroke", "black")
        }

        draw_box(data.filter(d => (d.gender == 'Male')))
        d3.selectAll(("input[name='gender']")).on("change", function () {
            svg.selectAll('*').remove()
            var data_by_gender = data.filter(d => (d.gender == this.value))
            draw_box(data_by_gender)
        })

        // Y axis label:
        svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", (height / 2) - 280)
        .attr("x", -200)
        .text("Age (in Years)")


    })
}

var question6 = function(filePath){
    const file = d3.csv(filePath, function(data){
        // Russia athletes can not particiapte under russian flag, must link Russian athletes (ROC) to Russia.
        var convertCountryCode = function(country){
            switch (country){
                case 'ROC': return 'RUS'
                default: return country
            }
        }
        return {
            "ID": convertCountryCode(data['Country Code']),
            "Order": data.Order,
            "Country": data.Country,
            "Gold": parseFloat(data.Gold),
            "Silver": parseFloat(data.Silver),
            "Bronze": parseFloat(data.Bronze),
            "Total": parseFloat(data.Total),
            "Order by Total": data["Order by Total"],
        }
    });
    file.then(function(data) {
        // Define and plot svg
        var margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
        var svg = d3.select("#q6_plot")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
        
        // Projection of geomap plot.
        var projection = d3.geoNaturalEarth()
        .scale(width / 2 / Math.PI)
        .translate([width / 2, height / 2])
                  
        // Define geo path
        const path = d3.geoPath().projection(projection);

        // Add title
        svg.append("text")
            .attr("x", (width / 2))             
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("text-decoration", "underline")  
            .text("Choropleth Map of Medals Won In Beijing 2022 Olympics");

        // Set color scale for choropleth
        var colors = d3.scaleThreshold()
        .domain([1,2,3,7,14,17,25,27,32,37])
        .range(["#C0C0C0","#81badb","#6badd5","#57a0ce","#4391c6","#3282bd","#2270b3","#1662a9","#0d5299","#083d7f","#08306b"]);

        // Define tooltip
        var tooltip=d3.select('#q6_plot').append("div").attr("style", "position: absolute")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style('font-size', '16px')
        //.style('margin', '5px')

        // Load the data up for choropleth
        Promise.all([
            d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
          data
        ]).then( d => drawMap(null, d[0], d[1]));

        function drawMap(error, data, medals){
            svg.append("g").selectAll("path").data(data.features).enter().append("path")
            // Geo path to generate countries on map.
            .attr("d", d3.geoPath().projection(projection))
            // Register tooltip on mousing over, on and out.
            .on('mouseover', (e,d) => {
                tooltip.transition().duration(100).style('opacity',0.9);
                var value = medals.find((m) => m.ID == d.id)
                var country = data.features.find((m) => m.id == d.id).properties.name
                // No olympics data, 0 medals earned.
                if (typeof value == 'undefined'){
                    totalMedals = 0
                    tooltip.html(country + ': ' + totalMedals + ' total medals.')
                    .style('left',e.pageX+'px').style('top',e.pageY+'px')
                }
                else{
                    totalMedals = value.Total
                    tooltip.html('<b><center>' + country + '</center></b>' + 'Total: ' + totalMedals + '<br> Gold ' +  String.fromCodePoint(0x1F947) + ': ' + value.Gold
                    + '<br> Silver ' + String.fromCodePoint(0x1F948)+ ': ' + value.Silver + '<br> Bronze ' + String.fromCodePoint(0x1F949) + ': '+  value.Bronze) 
                   .style('left',e.pageX+'px').style('top',e.pageY+'px')
                }
            })
            .on('mousemove', (e,d) => {
                tooltip.transition().duration(100).style('opacity',0.9);
                var value = medals.find((m) => m.ID == d.id)
                var country = data.features.find((m) => m.id == d.id).properties.name
                // No olympics data, 0 medals earned.
                if (typeof value == 'undefined'){
                    totalMedals = 0
                    tooltip.html(country + ': ' + totalMedals + ' total medals.')
                    .style('left',e.pageX+'px').style('top',e.pageY+'px')
                }
                else{
                    totalMedals = value.Total
                    tooltip.html('<b><center>' + country + '</center></b>' + 'Total: ' + totalMedals + '<br> Gold ' +  String.fromCodePoint(0x1F947) + ': ' + value.Gold
                    + '<br> Silver ' + String.fromCodePoint(0x1F948)+ ': ' + value.Silver + '<br> Bronze ' + String.fromCodePoint(0x1F949) + ': '+  value.Bronze) 
                   .style('left',e.pageX+'px').style('top',e.pageY+'px')
                }
            })
            .on('mouseout', (e,d) => {
                tooltip.transition().duration(100).style('opacity',0);
            })
            // Fill based on number of medals won.
            .attr('fill', d => {
            value = medals.find((m) => m.ID == d.id)
            // If no data in olympics data set, country did not earn any medals.
            if (typeof value == 'undefined'){
                totalMedals = 0
            }
            else{
                totalMedals = value.Total
            }
            return colors(totalMedals)
            })
    
        }

    })
    
}



