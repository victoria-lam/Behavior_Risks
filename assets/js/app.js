// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.

// if the SVG area isn't empty when the browser loads,
// remove it and replace it with a resized version of the chart
var svgArea = d3.select("body").select("svg");

// clear svg is not empty
if (!svgArea.empty()) {
  svgArea.remove();
}

  // set width and height of SVG
  var svgWidth = window.innerWidth - 20;
  var svgHeight = window.innerHeight - 20;

  var margin = {
      top: 20,
      right: 40,
      bottom: 60,
      left: 100
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // create an SVG wrapper, append an SVG group that will hold our chart 
  // and shift the latter by left and top margins
  var svg = d3.select(".chart")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

  // append group element
  var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)

  // inital param
  var initialXAxis = "labor_force"
  
////////////////////////////////////////////////////////////////////
// function used to update x-scale var on click on axis label
function xScale(healthData, initialXAxis) {
  //create scale functions 
  var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[initialXAxis]) * 0.8, 
          d3.max(healthData, d => d[initialXAxis]) * 1.2])
      //.domain([0,20])
      .range([0, width])
  
  return xLinearScale
};

// function used to update x-axis var on click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale)

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis)

  return xAxis
};

// function used for updating circles group with transition to
// new circles
function renderCircles(circlesGroup, newXScale, initialXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[initialXAxis]))

  return circlesGroup
};

// function to update circles group with new tooltip
function updateToolTip(initialXAxis, circlesGroup) {
  if (initialXAxis == "labor_force") {
      var label = "In Labor Force:"
  } else {
      var label = "Poverty:"
  }
  
  //initialize tool tip
  var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function (d) {
          return (`${d.state}<br>${label} ${d[initialXAxis]}% <br>With Depression: ${d.depression}%`)
      });
  
  // create tooltip in chart
  chartGroup.call(toolTip);

  // create event listener to display/hide tooltip
  circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function(data, index) {
          toolTip.hide(data);
      });
  
  return circlesGroup
};

////////////////////////////////////////////////////////////////////
// import data
d3.csv("data.csv", function(error, healthData) {
      if (error) throw error;

      // parse data as numbers
      healthData.forEach(function (data) {
          data.labor_force = +data.labor_force;
          data.depression = +data.depression;
          data.poverty = +data.poverty;
          data.internet = +data.internet;
          data.divorced = +data.divorced;
          data.smoker = +data.smoker;
      });
      // create scale functions 
  var xLinearScale = xScale(healthData, initialXAxis);

  var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.depression)-5, d3.max(healthData, d => d.depression)+5])
      .range([height, 0]);
  
  // create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append axes to chart
  // append x-axis
  var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis)
  
  // append y-axis
  chartGroup.append("g")
      .call(leftAxis);

  // create circles
  var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[initialXAxis]))
      .attr("cy", d => yLinearScale(d.depression))
      .attr("r", 10)
      .attr("fill", "blue")
      .attr("opacity", "0.5")
  
  // create for group for 3 x-axis labels
  var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width/2}, ${height + 20})`)
  
  // append demographics to labels group
  var laborForceLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "labor_force") // value for event listener
      .classed("active", true)
      .text("% in Labor Force");
  
  var povertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "poverty")
      .classed("inactive", true)
      .text("% Poverty Status - Over 18 Years Old");
  
  // var divorcedLabel = labelsGroup.append("text")
  //     .attr("x", 0)
  //     .attr("y", 60)
  //     .attr("value", "divorced")
  //     .classed("inactive", true)
  //     .text("% Divorced");
  
  // append y-axis
  chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("% With Depression");
  
  // updateTooltop function above csv import
  var circlesGroup = updateToolTip(initialXAxis, circlesGroup);

  // x-axis labels event listener
  xlabelsGroup.selectAll("text")
      .on("click", function() {
          // select value
          var value = d3.select(this).attr("value")
          if (value != initialXAxis) {
              
              // replace initial x-axis with value
              initialXAxis = value;

              console.log(initialXAxis);
              
              // update using above functions
              // update x-scale
              xLinearScale = xScale(healthData, initialXAxis);

              // update x-axis 
              xAxis = renderAxes(xLinearScale, xAxis);

              // update circles with new x values
              circlesGroup = renderCircles(circlesGroup, xLinearScale, initialXAxis);

              // update tooltips 
              circlesGroup = updateToolTip(initialXAxis, circlesGroup);

              // changes classes to change bold text
              if (initialXAxis == "poverty") {
                  laborForceLabel
                      .classed("active", true)
                      .classed("inactive", false)
                  povertyLabel
                      .classed("active", false)
                      .classed("inactive", true)
              } else {
                  laborForceLabel
                      .classed("active", false)
                      .classed("inactive", true)
                  povertyLabel
                      .classed("active", true)
                      .classed("inactive", false)
              };
          };
      });
  }); 
