// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.

//When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

// When the browser loads, makeResponsive() is called.
makeResponsive();

// The code for the chart is wrapped inside a function that automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
    makeScatter();
  }
};

//create scatter plot
makeScatter();

function makeScatter() {
  // set width and height of SVG
  var svgWidth = window.innerWidth - 20;
  var svgHeight = window.innerHeight - 20;

  var margin = { top: 20, right: 40, bottom: 100, left: 100 };

  width = svgWidth - margin.left - margin.right
  height = svgHeight - margin.top - margin.bottom

  // create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
   
  // append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // import data from the CSV file
  d3.csv("data.csv", function(error, healthData) {
    if (error) throw error;

    // parse data as numbers
    healthData.forEach(function(data) {
      data.labor_force = +data.labor_force;
      data.depression = +data.depression;
      data.poverty = +data.poverty;
      data.internet = +data.internet;
      data.divorced = +data.divorced;
      data.smoker = +data.smoker;
    });

    // create variables to store min and max values 
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    // find max and min values of columns in data.csv for x- and y-axis
    function maxAndMinX(xAxisColumn) {
        xMin = d3.min(healthData, d => d[xAxisColumn]) * 0.9;
        xMax = d3.max(healthData, d => d[xAxisColumn]) * 1.1;
    }

    function maxAndMinY(yAxisColumn) {
      yMin = d3.min(healthData, d => d[yAxisColumn]) * 0.9;
      yMax = d3.max(healthData, d => d[yAxisColumn]) * 1.1;
    }

    // initial params
    var initialXAxis = "labor_force";
    maxAndMinX(initialXAxis);

    var initialYAxis = "depression";
    maxAndMinY(initialYAxis);

    // create scale functions
    var yLinearScale = d3.scaleLinear().range([height, 0]);

    var xLinearScale = d3.scaleLinear().range([0, width]);

    // create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    // set the domain of an axis to extend from the min to the max value of the data column
    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);

    // initialize tooltip
    var toolTip = d3
      .tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
      // assign tooltip text based on active axis
        if (initialXAxis === "labor_force") {
          xlabel = "In labor force: ";
        }
        else if (initialXAxis === "poverty") {
        	xlabel = "With poverty status: "
        }
        else {
          xlabel = "Divorced: ";
        }

  	  if (initialYAxis === "depression") {
          ylabel = "With depression: ";
        }
        else if (initialYAxis === "internet") {
        	ylabel = "Internet usage: "
        }
        else {
          ylabel = "Smoker: ";
        }

        return (`${d.state}<br>${xlabel} ${d[initialXAxis]}% <br>${ylabel} ${d[initialYAxis]}%`)
      });

    // Create tooltip
    chartGroup.call(toolTip);
    
    // create circles
    chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[initialXAxis]))
      .attr("cy", d => yLinearScale(d[initialYAxis]))
      .attr("r", 14)
      .attr("fill", "lightblue")

      // display tooltip on click
      .on("click", function(data) {
        toolTip.show(data);
      })
      .on("mouseover", function(data) {
        d3.select(this).style("fill", "#05386B")
      })
      .on("mouseout", function(data) {
        d3.select(this).style("fill", "lightblue");
        toolTip.hide(data)
      });

      // anchor abbr to middle of circles
      chartGroup.selectAll(null)
          .data(healthData)
          .enter()
          .append("text")
          .attr("x", d => xLinearScale(d[initialXAxis]))
          .attr("y", d => yLinearScale(d[initialYAxis]))
          .attr("text-anchor", "middle")
          .text(d => d.abbr)
          .attr("class", "circleLabel") // create class called circleLabel for transition effect
          .attr("font-size", 12)
          .attr("fill", "white");


    // append group for x-axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("class", "x-axis") // create class for transition effects
        .call(bottomAxis);

    // append group for y-axis
    chartGroup.append("g")
    	.attr("class", "y-axis") // create class for transition effects
    	.call(leftAxis);

    // append 3 y-axis label variations
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 10)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("class", "active yLabel")
      .attr("axis-name", "depression")
      .text("With Depression (%)");
    
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 35)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("class", "inactive yLabel")
      .attr("axis-name", "internet")
      .text("On the Internet in the Last 30 Days (%)");
    
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 60)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .attr("class", "inactive yLabel")
      .attr("axis-name", "smoker")
      .text("Smoker (%)");

    // append 3 x-axis label variations
    chartGroup.append("text")
      .attr("transform", `translate(${width/2}, ${height + margin.top + 20})`)
      .attr("class", "active xLabel") // default active x-axis
      .attr("axis-name", "labor_force") // create attribute named "axis-name"
      .text("In the Labor Force (%)");
    
    chartGroup.append("text")
      .attr("transform", `translate(${width/2}, ${height + margin.top + 45})`)
      .attr("class", "inactive xLabel") // default inactive x-axis
      .attr("axis-name", "poverty")
      .text("Poverty (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width/2}, ${height + margin.top + 70})`)
      .attr("class", "inactive xLabel") // default inactive x-axis
      .attr("axis-name", "divorced")
      .text("Divorced (%)");

///////////////////////////////////////////////////////////////////////////
/* create function to change active/inactive status of axis when clicked */
///////////////////////////////////////////////////////////////////////////

// change scatter plot for x-axis 
function xlabelChange(selectedX) {
    d3.selectAll(".xLabel")
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    selectedX
        .classed("inactive", false)
        .classed("active", true);
      }

  d3.selectAll(".xLabel").on("click", function() {
    // assign variable to current axis
    var currentSelection = d3.select(this);

    // set currentValue inactive when new x-axis is clicked
    var currentSelectionInactive = currentSelection.classed("inactive");
    console.log("Selected x-axis is now inactive", currentSelectionInactive);
    
    // get attribute of selected axis
    var selectedX = currentSelection.attr("axis-name");
    console.log("Current selected x-axis: ", selectedX);

    // on click event if selected x-axis is currently inactive
    if (currentSelectionInactive) {

        // replace initial x-axis with selected x-axis
        initialXAxis = selectedX;
        
        // call function to find new min and max domain values
        maxAndMinX(initialXAxis);

        // set new domain for x-axis
        xLinearScale.domain([xMin, xMax]);

        // create transition effect for x-axis using created class attr
        svg.select(".x-axis")
      	    .transition()
            .duration(1000)
            .call(bottomAxis);

        // select circles and create transition effect
        d3.selectAll("circle").each(function() {
            d3.select(this)
              .transition()
              .attr("cx", d => xLinearScale(d[initialXAxis]))
              .duration(1000);
        });
        
        // select text in circles and create transition effect
        d3.selectAll(".circleLabel").each(function() {
            d3.select(this)
               .transition()
               .attr("x", d => xLinearScale(d[initialXAxis]))
               .duration(1000);
        });

        // change status of axis
        xlabelChange(currentSelection);
    }
   }); 

  /////////////////////////

// change scatter plot for y-axis 
function ylabelChange(selectedY) {
    d3.selectAll(".yLabel")
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    selectedY
      .classed("inactive", false)
      .classed("active", true);
}

// y-axis labels event listener
d3.selectAll(".yLabel").on("click", function() {
      // assign variable to current axis
      var currentSelection = d3.select(this);

      // set currentValue inactive when new y-axis is clicked
      var currentSelectionInactive = currentSelection.classed("inactive");
      console.log("Selected y-axis is now inactive", currentSelectionInactive);
      
      // get attribute of selected axis
      var selectedY = currentSelection.attr("axis-name");
      console.log("Current selected y-axis: ", selectedY);
      
      // on click event if selected y-axis is currently inactive
      if (currentSelectionInactive) {
        // replace initial x-axis with selected y-axis
        initialYAxis = selectedY;

        // call function to find new min and max domain values
        maxAndMinY(initialYAxis);

        // set new domain for y-axis
        yLinearScale.domain([yMin, yMax]);

        // create transition effect for y-axis using created class attr
        svg.select(".y-axis")
        	.transition()
            .duration(1000)
            .call(leftAxis);
        
        // select circles and create transition effect
        d3.selectAll("circle").each(function() {
          d3.select(this)
            .transition()
            .attr("cy", d => yLinearScale(d[initialYAxis]))
            .duration(1000);
        });
        
        // select text in circles and create transition effect
        d3.selectAll(".circleLabel").each(function() {
          d3.select(this)
          .transition()
          .attr("y", d => yLinearScale(d[initialYAxis]))
          .duration(1000);
      });
        // change status of axis
        ylabelChange(currentSelection);
      }
    });

  });
};
