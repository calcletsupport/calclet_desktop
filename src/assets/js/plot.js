// Plot functions

function outputPlotXY(text, xVar, yVar) {

    var randomNumber = Math.floor(Math.random() * 10000000);
    var svgName = "svg-plot"; // + randomNumber;

    var data = []
    for (var i = 0; i < xVar.length; i++) {
        data.push([xVar[i], yVar[i]])
    }

    var xmin, xmax, ymin, ymax

    var xmin = d3.min(data, d => d[0])
    var xmax = d3.max(data, d => d[0])
    var ymin = d3.min(data, d => d[1])
    var ymax = d3.max(data, d => d[1])


    var nxmax, nxmin;
    nxmax = 0;
    nxmin = 0

    if (xmax != 0) {
        var nxmax = parseInt(Math.log10(Math.abs(xmax)))
    }

    if (xmin != 0) {
        var nxmin = parseInt(Math.log10(Math.abs(xmin)))
    }

    if (nxmax < nxmin) {
        nxmax = nxmin
    }

    var xmax0 = xmax / Math.pow(10, nxmax)
    var xmin0 = xmin / Math.pow(10, nxmax)

    xmax = xmax0
    xmin = xmin0

    var nymax, nymin
    nymax = 0;
    nymin = 0
    if (ymax != 0) {
        var nymax = parseInt(Math.log10(Math.abs(ymax)))
    }
    if (ymin != 0) {
        var nymin = parseInt(Math.log10(Math.abs(ymin)))
    }
    if (nymax < nymin) {
        nymax = nymin
    }

    var ymax0 = ymax / Math.pow(10, nymax)
    var ymin0 = ymin / Math.pow(10, nymax)

    ymax = ymax0
    ymin = ymin0


    var div_field = document.createElement("div");
    div_field.setAttribute("class", "field");

    var label_text = document.createElement("label");
    label_text.setAttribute("class", "label");
    var t = document.createTextNode(text);
    label_text.appendChild(t);
    div_field.appendChild(label_text)
    document.getElementById("output").appendChild(div_field);


    var div_flex = document.createElement("div");
    div_flex.setAttribute("class", "flex-container");


    var div_scatter = document.createElement("div");
    div_scatter.setAttribute("id", svgName);

    div_flex.appendChild(div_scatter)

    document.getElementById("output").appendChild(div_flex);

// set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 40, left: 40},
        width = 450 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svG = d3.select("#" + svgName)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


// X Scale, Axis and Text
    var xScale = d3.scaleLinear()
        .domain([xmin, xmax])
        .range([0, width]);
    svG
        .append('g')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    var xText = "X (10^" + nxmax + ")"
    svG.append("text")
        .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text(xText);


// Y Scale, Axis and Text
    var yScale = d3.scaleLinear()
        .domain([ymin, ymax])
        .range([height, 0]);
    svG
        .append('g')
        .call(d3.axisLeft(yScale));

    var yText = "Y (10^" + nymax + ")"
    svG.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 10)
        .attr("x", -width / 2)
        .style("text-anchor", "middle")
        .text(yText);

// Add line

    var myline = d3.line()
        .x(d => xScale(d[0] / Math.pow(10, nxmax)))
        .y(d => yScale(d[1] / Math.pow(10, nymax)));
    svG.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", myline)
}


function outputPlotXY_2() {

    var randomNumber = Math.floor(Math.random() * 10000000);
    var svgName = "svg-plot"; // + randomNumber;

    var div_svg = document.createElement("div");
    div_svg.setAttribute("id", svgName);
    document.getElementById("output").appendChild(div_svg);

    var widthOuter = 450;
    var heightOuter = 320;
    var margin = {top: 10, right: 40, bottom: 80, left: 40};
    var width = widthOuter - margin.left - margin.right;
    var height = heightOuter - margin.top - margin.bottom;

    var raw = []
    var result = []

    for (var i = 0; i < arguments.length; i++) {
        raw = arguments[i]
        var title = raw[0]

        for (var j = 1; j < raw.length; j++) {
            var xy = raw[j]
            var x = xy[0]
            var y = xy[1]

            var obj = {}
            obj["xTitle"] = title[0]
            obj["yTitle"] = title[1]
            obj["x"] = x
            obj["y"] = y
            result.push(obj)
        }
    }

    var data = result

    data.forEach(function (d) {
        d.x = +d.x;
        d.y = +d.y;
    })

    console.log('data', data)

    var [xmin,xmax,nxmax,ymin,ymax,nymax] = getMaxMin1(data)
    console.log('xmin,xmax,nxmax,ymin,ymax,nymax', xmin, xmax, nxmax, ymin, ymax, nymax)


    var SVG = d3.select("#" + svgName)
        .append("svg")
        .attr("width", widthOuter)
        .attr("height", heightOuter)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    const scaleX = d3.scaleLinear()
        .domain([xmin, xmax])
        .range([0, width])
        .nice();

    var xText = "X (10^" + nxmax + ")"
    SVG.append("text")
        .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .style("font", "12px snas-serif")
        .text(xText);

    const scaleY = d3.scaleLinear()
        .domain([ymin, ymax])
        .range([height, 0])
        .nice();

    var yText = "Y (10^" + nymax + ")"
    SVG.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 10)
        .attr("x", -width / 2)
        .style("text-anchor", "middle")
        .style("font", "12px snas-serif")
        .text(yText);

    var line = d3.line()
        .x(d => scaleX(d.x / Math.pow(10, nxmax)))
        .y(d => scaleY(d.y / Math.pow(10, nymax))).curve(d3.curveCardinal)

    var dataGroup = Array.from(d3.group(data, d => d.yTitle), ([key, value]) => ({key, value}))
    var color = d3.scaleOrdinal()
        .domain([0, dataGroup.length])
        .range(d3.schemeCategory10);

    var leftLegend = []
    for (var i = 0; i < dataGroup.length; i++) {
        var num = i
        leftLegend.push(num.toString())
    }

    dataGroup.forEach(function (d, i) {

        SVG.append("path")
            .attr("class", "line")
            .style("stroke", function () { // Add the colours dynamically
                return d.color = color(d.key);
            })
            .style("stroke-width", "3px")
            .style("fill", "none")
            .attr("d", line(d.value));

        // Add Bottom Legend

        SVG.append("text")
            .attr("x", margin.left) // spacing
            .attr("y", margin.top + height + 35 + 20 * i)
            .attr("class", "legend")    // style the legend
            .style("fill", function () { // dynamic colours
                return d.color = color(d.key);
            })
            .style("font", "11px snas-serif")
            .text(leftLegend[i] + " " + d.key);


// Add dot to Left Legend

        SVG.append("circle")
            .attr("cx", margin.left + width / 1.03 - 6)
            .attr("cy", margin.top + i * 20 - 5)
            .attr("r", 3)
            .attr("class", "circle")    // style the legend
            .style("fill", function () { // dynamic colours
                return d.color = color(d.key);
            })

        // Add the Left Legend
        SVG.append("text")
            .attr("x", margin.left + width / 1.03) // spacing
            .attr("y", margin.top + i * 20)
            .attr("class", "legend")    // style the legend
            .style("fill", function () { // dynamic colours
                return d.color = color(d.key);
            })
            .style("font", "11px snas-serif")
            .text(leftLegend[i]);

    });


    const xAxis = d3.axisBottom(scaleX);
    const yAxis = d3.axisLeft(scaleY);
    const axes = SVG.append("g").attr("class", "axes");
    axes.append("g").call(xAxis)
        .attr("transform", `translate(${[0, height]})`);
    axes.append("g").call(yAxis)
        .attr("transform", `translate(${[0, 0]})`);

    SVG.append("text")
        .attr("transform",
        "translate(" + (width / 2) + " ," +
        (margin.top / 2) + ")")
        .style("text-anchor", "middle")
        .style("font", "14px snas-serif")
        .text("Chart Title");
}

function getMaxMin1(data) {

    var xmin, xmax, ymin, ymax

    var xmin = d3.min(data, d => d.x)
    var xmax = d3.max(data, d => d.x)
    var ymin = d3.min(data, d => d.y)
    var ymax = d3.max(data, d => d.y)

    var nxmax, nxmin
    nxmax = 0;
    nxmin = 0
    if (xmax != 0) {
        var nxmax = parseInt(Math.log10(Math.abs(xmax)))
    }
    if (xmin != 0) {
        var nxmin = parseInt(Math.log10(Math.abs(xmin)))
    }
    if (nxmax < nxmin) {
        nxmax = nxmin
    }

    var xmax0 = xmax / Math.pow(10, nxmax)
    var xmin0 = xmin / Math.pow(10, nxmax)

    xmax = xmax0
    xmin = xmin0

    var nymax, nymin
    nymax = 0;
    nymin = 0
    if (ymax != 0) {
        var nymax = parseInt(Math.log10(Math.abs(ymax)))
    }
    if (ymin != 0) {
        var nymin = parseInt(Math.log10(Math.abs(ymin)))
    }
    if (nymax < nymin) {
        nymax = nymin
    }

    var ymax0 = ymax / Math.pow(10, nymax)
    var ymin0 = ymin / Math.pow(10, nymax)

    ymax = ymax0
    ymin = ymin0

    return [xmin, xmax, nxmax, ymin, ymax, nymax]
}


function outputPlotXY_3() {

    var svgName = "svg-plot"; // + randomNumber;

    var div_svg = document.createElement("div");
    div_svg.setAttribute("id", svgName);
    document.getElementById("output").appendChild(div_svg);

    var widthOuter = 450;
    var heightOuter = 320;
    var margin = {top: 10, right: 40, bottom: 80, left: 40};

    margin.bottom = 80 * arguments.length
    var heightOuter = 220 + margin.bottom;

    width = widthOuter - margin.left - margin.right;
    height = heightOuter - margin.top - margin.bottom;

    var raw = []
    var result = []

    for (var i = 0; i < arguments.length; i++) {
        raw = arguments[i]
        var title = raw[0]

        for (var j = 1; j < raw.length; j++) {
            var xy = raw[j]
            var x = xy[0]
            var y = xy[1]

            var obj = {}
            obj["xTitle"] = title[0]
            obj["yTitle"] = title[1]
            obj["x"] = x
            obj["y"] = y
            result.push(obj)
        }
    }

    var data = result

    data.forEach(function (d) {
        d.x = +d.x;
        d.y = +d.y;
    })

    // console.log('data',data)
    var [xmin,xmax,nxmax,ymin,ymax,nymax] = getMaxMin1(data)
    console.log('xmin,xmax,nxmax,ymin,ymax,nymax', xmin, xmax, nxmax, ymin, ymax, nymax)


    var SVG = d3.select("#" + svgName)
        .append("svg")
        .attr("width", widthOuter)
        .attr("height", heightOuter)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    const scaleX = d3.scaleLinear()
        .domain([xmin, xmax])
        .range([0, width])
        .nice();

    var xText = "X (10^" + nxmax + ")"
    SVG.append("text")
        .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .style("font", "12px snas-serif")
        .text(xText);

    const scaleY = d3.scaleLinear()
        .domain([ymin, ymax])
        .range([height, 0])
        .nice();

    var yText = "Y (10^" + nymax + ")"
    SVG.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 10)
        .attr("x", -width / 2)
        .style("text-anchor", "middle")
        .style("font", "12px snas-serif")
        .text(yText);


    var line = d3.line()
        .x(d => scaleX(d.x / Math.pow(10, nxmax)))
        .y(d => scaleY(d.y / Math.pow(10, nymax))).curve(d3.curveCardinal)

    dataGroup = Array.from(d3.group(data, d => d.yTitle), ([key, value]) => ({key, value}))

    var color = d3.scaleOrdinal()
        .domain([0, dataGroup.length])
        .range(d3.schemeCategory10);

    var leftLegend = []
    for (var i = 0; i < dataGroup.length; i++) {
        var num = i
        leftLegend.push(num.toString())
    }

    dataGroup.forEach(function (d, i) {

        SVG.append("path")
            .attr("class", "line")
            .style("stroke", function () { // Add the colours dynamically
                return d.color = color(d.key);
            })
            .style("stroke-width", "3px")
            .style("fill", "none")
            .attr("d", line(d.value));
        SVG.append("text")
            .attr("x", margin.left / 4) // spacing
            .attr("y", margin.top + height + 35 + 20 * i)
            .attr("class", "legend")    // style the legend
            .style("fill", function () { // dynamic colours
                return d.color = color(d.key);
            })
            .style("font", "11px snas-serif")
            .text(leftLegend[i] + " " + d.key);

        // Add Bottom Legend

        SVG.append("circle")
            .attr("cx", margin.left + width / 1.03 - 6)
            .attr("cy", margin.top + i * 20 - 5)
            .attr("r", 3)
            .attr("class", "circle")    // style the legend
            .style("fill", function () { // dynamic colours
                return d.color = color(d.key);
            })

        // Add the Left Legend
        SVG.append("text")
            .attr("x", margin.left + width / 1.03) // spacing
            .attr("y", margin.top + i * 20)
            .attr("class", "legend")    // style the legend
            .style("fill", function () { // dynamic colours
                return d.color = color(d.key);
            })
            .style("font", "11px snas-serif")
            .text(leftLegend[i]);

    });

    const xAxis = d3.axisBottom(scaleX);
    const yAxis = d3.axisLeft(scaleY);
    const axes = SVG.append("g").attr("class", "axes");
    axes.append("g").call(xAxis)
        .attr("transform", `translate(${[0, height]})`);
    axes.append("g").call(yAxis)
        .attr("transform", `translate(${[0, 0]})`);

    SVG.append("text")
        .attr("transform",
        "translate(" + (width / 2) + " ," +
        (margin.top / 2) + ")")
        .style("text-anchor", "middle")
        .style("font", "14px snas-serif")
        .text("Chart Title");
}

/////////////////////////////////////////////
function outputContour(xCoord, yCoord, Value) {
/////////////////////////////////////////////

    var randomNumber = Math.floor(Math.random() * 10000000);
    var svgName = "svg-plot"; //  + randomNumber;

    var div_scatter = document.createElement("div");
    div_scatter.setAttribute("id", svgName);
    document.getElementById("output").appendChild(div_scatter)

    var nX = xCoord.length
    var nY = yCoord.length
    var nVal = Value.length

    // Form 2d mesh

    var x = new Array(nVal)
    var y = new Array(nVal)
    var k = 0
    for (var j = 0; j < yCoord.length; j++) {
        for (var i = 0; i < xCoord.length; i++) {
            x[k] = xCoord[i]
            y[k] = yCoord[j]
            k += 1
        }
    }

    var ielem = new Array(3)
    for (var i = 0; i < ielem.length; i++) {
        ielem[i] = new Array((nX - 1) * (nY - 1) * 2)
    }

    var k = 0
    for (var j = 0; j < (nY - 1); j++) {
        for (var i = 0; i < (nX - 1); i++) {
            ielem[0][k] = i + nX * j
            ielem[1][k] = ielem[0][k] + nX + 1
            ielem[2][k] = ielem[1][k] - 1
            ielem[0][k + 1] = ielem[0][k]
            ielem[1][k + 1] = ielem[0][k] + 1
            ielem[2][k + 1] = ielem[1][k]
            k += 2
        }
    }

    var data = []
    for (var i = 0; i < x.length; i++) {
        data.push([x[i], y[i]])
    }

    var [xmin,xmax,nxmax,ymin,ymax,nymax] = getMaxMin(data)


    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 100, left: 40},
        width = 450 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svG = d3.select("#" + svgName)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // X Scale, Axis and Text
    var xScale = d3.scaleLinear()
        .domain([xmin, xmax])
        .range([0, width]);
    svG
        .append('g')
        .attr("transform", "translate(0," + (height + 0) + ")")
        .call(d3.axisBottom(xScale));

    var xText = "X (10^" + nxmax + ")"
    svG.append("text")
        .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top + 20) + ")")
        .style("text-anchor", "small")
        .text(xText);

    // Y Scale, Axis and Text
    var yScale = d3.scaleLinear()
        .domain([ymin, ymax])
        .range([height, 0]);
    svG
        .append('g')
        .call(d3.axisLeft(yScale));

    var yText = "Y (10^" + nymax + ")"
    svG.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 10)
        .attr("x", -width / 2)
        .style("text-anchor", "small")
        .text(yText);

    // Add Outline

    var data = []
    data.push([xmin, ymin])
    data.push([xmax, ymin])
    data.push([xmax, ymax])
    data.push([xmin, ymax])
    data.push([xmin, ymin])

    var line = d3.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]));
    svG.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#ffeeaa")
        .attr("stroke-width", 1.5)
        .attr("d", line)


    // Add Mesh
    /*

     for (var i=0; i<ielem[0].length; i++) {

     var data = []
     for (var j=0; j<ielem.length; j++){""
     data.push([x[ielem[j][i]],y[ielem[j][i]]])
     }
     data.push([x[ielem[0][i]],y[ielem[0][i]]])

     var myline = d3.line()
     .x(d => xScale(d[0]/Math.pow(10,nxmax)))
     .y(d => yScale(d[1]/Math.pow(10,nymax)));
     svG.append("path")
     .datum(data)
     .attr("fill", "none")
     .attr("stroke", "steelblue")
     .attr("stroke-width", 1.5)
     .attr("d", myline)
     }
     */
    //  Add contours

    var data = []
    for (var i = 0; i < Value.length; i++) {
        data.push([Value[i]])
    }

    //var vmin,vmax

    var vmin = d3.min(data, d => d[0])
    var vmax = d3.max(data, d => d[0])

    var ncon = 20
    var color = d3.scaleOrdinal()
        .domain([0, ncon])
        .range(d3.schemeCategory10);

    for (var i = 0; i < ielem[0].length; i++) {

        for (var j = 1; j < (ncon - 1); j++) {
            var valCon = vmin + (vmax - vmin) * j / (ncon - 1)
            var data = []

            var s01 = false
            var s12 = false
            var s20 = false

            var t1 = (Value[ielem[0][i]] <= valCon)
            var t2 = (Value[ielem[1][i]] > valCon)
            var t12 = (t1 && t2)
            var t3 = (Value[ielem[1][i]] <= valCon)
            var t4 = (Value[ielem[0][i]] > valCon)
            var t34 = (t3 && t4)
            var t1234 = (t12 || t34)
            if (t1234) {
                s01 = true
            }

            var t1 = (Value[ielem[1][i]] <= valCon)
            var t2 = (Value[ielem[2][i]] > valCon)
            var t12 = (t1 && t2)
            var t3 = (Value[ielem[2][i]] <= valCon)
            var t4 = (Value[ielem[1][i]] > valCon)
            var t34 = (t3 && t4)
            var t1234 = (t12 || t34)
            if (t1234) {
                s12 = true
            }

            var t1 = (Value[ielem[2][i]] <= valCon)
            var t2 = (Value[ielem[0][i]] > valCon)
            var t12 = (t1 && t2)
            var t3 = (Value[ielem[0][i]] <= valCon)
            var t4 = (Value[ielem[2][i]] > valCon)
            var t34 = (t3 && t4)
            var t1234 = (t12 || t34)
            if (t1234) {
                s20 = true
            }

            if (s01) {
                var ratio = (valCon - Value[ielem[0][i]]) /
                    (Value[ielem[1][i]] - Value[ielem[0][i]])
                var x01 = x[ielem[0][i]] + ratio * (x[ielem[1][i]] - x[ielem[0][i]])
                var y01 = y[ielem[0][i]] + ratio * (y[ielem[1][i]] - y[ielem[0][i]])
            }
            if (s12) {
                var ratio = (valCon - Value[ielem[1][i]]) /
                    (Value[ielem[2][i]] - Value[ielem[1][i]])
                var x12 = x[ielem[1][i]] + ratio * (x[ielem[2][i]] - x[ielem[1][i]])
                var y12 = y[ielem[1][i]] + ratio * (y[ielem[2][i]] - y[ielem[1][i]])
            }
            if (s20) {
                var ratio = (valCon - Value[ielem[2][i]]) /
                    (Value[ielem[0][i]] - Value[ielem[2][i]])
                var x20 = x[ielem[2][i]] + ratio * (x[ielem[0][i]] - x[ielem[2][i]])
                var y20 = y[ielem[2][i]] + ratio * (y[ielem[0][i]] - y[ielem[2][i]])
            }

            if (s01) {
                data.push([x01, y01])
                if (s12) data.push([x12, y12])
                if (s20) data.push([x20, y20])
            }
            if (s12 && s20) {
                data.push([x12, y12])
                data.push([x20, y20])
            }
            var line = d3.line()
                .x(d => xScale(d[0] / Math.pow(10, nxmax)))
                .y(d => yScale(d[1] / Math.pow(10, nymax)));
            svG.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", color(j))
                .attr("stroke-width", 1.5)
                .attr("d", line)

        } // End of contour loop

    } // End of element loop


    var x0 = margin.left - 10
    var y0 = margin.top + height + 30
    var w0 = width - 60
    var w1 = w0 / (ncon - 1)

    for (var j = 1; j < ncon; j++) {
        var x1 = x0 + (j - 1) * w1
        console.log('x1', x1, w1, ncon, w0)
        svG.append('rect')
            .attr('x', x1)
            .attr('y', y0)
            .attr('width', w1)
            .attr('height', 10)
            .attr('stroke', 'none')
            .attr('fill', color(j - 1));
    }

    // X Scale, Axis and Text
    var vScale = d3.scaleLinear()
        .domain([vmin, vmax])
        .range([0, w0]);
    svG
        .append('g')
        .attr("transform",
        "translate(" + (x0) + " ," +
        (y0 + 10) + ")")
        .call(d3.axisBottom(vScale));

} // End of function

function getMaxMin(data) {

    //var xmin,xmax,ymin,ymax

    var xmin = d3.min(data, d => d[0])
    var xmax = d3.max(data, d => d[0])
    var ymin = d3.min(data, d => d[1])
    var ymax = d3.max(data, d => d[1])

    var nxmax, nxmin
    nxmax = 0;
    nxmin = 0
    if (xmax != 0) {
        nxmax = parseInt(Math.log10(Math.abs(xmax)))
    }
    if (xmin != 0) {
        nxmin = parseInt(Math.log10(Math.abs(xmin)))
    }
    if (nxmax < nxmin) {
        nxmax = nxmin
    }

    var xmax0 = xmax / Math.pow(10, nxmax)
    var xmin0 = xmin / Math.pow(10, nxmax)

    xmax = xmax0
    xmin = xmin0

    var nymax, nymin
    nymax = 0;
    nymin = 0
    if (ymax != 0) {
        nymax = parseInt(Math.log10(Math.abs(ymax)))
    }
    if (ymin != 0) {
        nymin = parseInt(Math.log10(Math.abs(ymin)))
    }
    if (nymax < nymin) {
        nymax = nymin
    }

    var ymax0 = ymax / Math.pow(10, nymax)
    var ymin0 = ymin / Math.pow(10, nymax)

    ymax = ymax0
    ymin = ymin0

    return [xmin, xmax, nxmax, ymin, ymax, nymax]
}


function outputContour_2(nL, nX, xMin, yMin, nY, xMax, yMax, func) {

    var [Value, Coord, Cell, Level] = getData(nL, nX, xMin, yMin, nY, xMax, yMax, func);

    drawData(Value, Coord, Cell, Level);

}

//*************** Functions ********/


function getData(nL, nX, xMin, yMin, nY, xMax, yMax, func) {

    var xCoord = new Array(nX)
    var yCoord = new Array(nY)

    for (var i = 0; i < nX; i++) {
        xCoord[i] = xMin + (xMax - xMin) * i / (nX - 1)
    }
    for (var i = 0; i < nY; i++) {
        yCoord[i] = yMin + (yMax - yMin) * i / (nY - 1)
    }

    var value = [], coord = []

    for (var i = 0; i < nX; i++) {
        var x1 = xCoord[i]
        for (var j = 0; j < nY; j++) {
            var y1 = yCoord[j]
            value.push(func(x1, y1))
            coord.push([x1, y1])
        }
    }
    var vmin, vmax

    vmin = d3.min(value, d => d)
    vmax = d3.max(value, d => d)

    var levels = d3.range(vmin, vmax, (vmax - vmin) / nL)

    var cell = []
    for (var i = 0; i < nX - 1; i++) {
        for (var j = 0; j < nY - 1; j++) {
            var k = i * nY + j
            cell.push([k, k + 1 + nY, k + nY], [k, k + 1, k + 1 + nY])
        }
    }

    return [value, coord, cell, levels]
}

//********************************************* FOCUS */

function drawData(value, coord, cell, levels) {

    var randomNumber = Math.floor(Math.random() * 10000000);
    var svgName = "svg-plot"; //  + randomNumber;

    var div_scatter = document.createElement("div");
    div_scatter.setAttribute("id", svgName);
    document.getElementById("output").appendChild(div_scatter)

    // Form 2d mesh

    var tmp = []
    for (var i = 0; i < coord.length; i++) {
        tmp.push(coord[i][0])
    }
    var [xmin,xmax,xminNat,xmaxNat,nxmax] = getMaxMin2(tmp)

    var tmp = []
    for (var i = 0; i < coord.length; i++) {
        tmp.push(coord[i][1])
    }
    var [ymin,ymax,yminNat,ymaxNat,nymax] = getMaxMin2(tmp)
 //   console.log('xmin,xmax,xminNat,xmaxNat,nxmax', xmin, xmax, xminNat, xmaxNat, nxmax)
 //   console.log('ymin,ymax,yminNat,ymaxNat,nymax', ymin, ymax, yminNat, ymaxNat, nymax)

// set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 100, left: 40},
        width = 450 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svG = d3.select("#" + svgName)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    var canvas = d3.select("#" + svgName)
        .append("canvas")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style('margin-left', -width - margin.right + 'px')

    var ctx = canvas.node().getContext("2d");
    ctx.translate(0, margin.top);

// X Scale, Axis and Text
    var xScale = d3.scaleLinear()
        .domain([xmin, xmax])
        .range([0, width]);
    svG
        .append('g')
        .attr("transform", "translate(0," + (height + 0) + ")")
        .call(d3.axisBottom(xScale));

    var xText = "X (10^" + nxmax + ")"
    svG.append("text")
        .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top + 20) + ")")
        .style("text-anchor", "small")
        .text(xText);

// Y Scale, Axis and Text
    var yScale = d3.scaleLinear()
        .domain([ymin, ymax])
        .range([height, 0]);
    svG
        .append('g')
        .call(d3.axisLeft(yScale));

    var yText = "Y (10^" + nymax + ")"
    svG.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 10)
        .attr("x", -width / 2)
        .style("text-anchor", "small")
        .text(yText);

// Add Outline

    tmp = []
    tmp.push([xmin, ymin])
    tmp.push([xmax, ymin])
    tmp.push([xmax, ymax])
    tmp.push([xmin, ymax])
    tmp.push([xmin, ymin])

    var myline = d3.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]));
    svG.append("path")
        .datum(tmp)
        .attr("fill", "none")
        .attr("stroke", "#ffeeaa")
        .attr("stroke-width", 1.5)
        .attr("d", myline)
// Add Mesh

    var xScaleNat = d3.scaleLinear()
        .domain([xminNat, xmaxNat])
        .range([0, width]);

    var yScaleNat = d3.scaleLinear()
        .domain([yminNat, ymaxNat])
        .range([height, 0]);

    /*
     for (var i=0; i<cell.length; i++) {
     tmp = []
     for (var j=0; j<cell[0].length; j++){
     k = cell[i][j]
     tmp.push([coord[k][0],coord[k][1]])}
     k = cell[i][0]
     tmp.push([coord[k][0],coord[k][1]])
     var myline = d3.line()
     .x(d => xScaleNat(d[0]))
     .y(d => yScaleNat(d[1]))
     svG.append("path")
     .datum(tmp)
     .attr("fill", "none")
     .attr("stroke", "steelblue")
     .attr("stroke-width", 1.5)
     .attr("d", myline)
     }
     */
//  Add contours

    var data = getContour(value, coord, cell, levels)

    console.log('data', data)

    var lines_level = data.lines
    var areas_level = data.area
    var nLevel = lines_level.length
    var colorScale = d3.scaleOrdinal()
        .domain([0, nLevel])
        .range(d3.schemeCategory10);

// ******************

    for (var i = 0; i < nLevel - 1; i++) {
        var lines = lines_level[i]
        for (var j = 0; j < lines.length; j++) {
            var myline = d3.line()

// canvas line
            /*
             .x(d => xScaleNat(d[0]))
             .y(d => yScaleNat(d[1]))
             .context(ctx);
             ctx.beginPath();
             myline(lines[j]);
             ctx.lineWidth = 1;
             ctx.strokeStyle = colorScale(i);
             ctx.stroke();
             */
// svg line
            /*
             .x(d => xScaleNat(d[0]))
             .y(d => yScaleNat(d[1]))
             svG.append("path")
             .datum(lines[j])
             .style("fill",colorScale(i))
             .style("stroke",colorScale(i))
             .attr("stroke-width", 1)
             .attr("d", myline)
             */

        }
    }

    for (var i = 0; i < nLevel - 1; i++) {
        var areas = areas_level[i]
        for (var j = 0; j < areas.length; j++) {
            var area = areas[j]
            // svg area

            var points = []
            for (var k = 0; k < area.length; k++) {
                var point = area[k]
                points.push(xScaleNat(point[0]), yScaleNat(point[1]))
            }
            svG.append('polygon')
                .attr('points', points)
                .attr('stroke', colorScale(i))
                .attr('fill', colorScale(i));

            // canvas area
            /*
             ctx.fillStyle = colorScale(i);
             //ctx.strokeColor = "red";
             ctx.lineWidth = 5;
             var point = area[0];
             ctx.beginPath();
             ctx.moveTo(xScaleNat(point[0]),yScaleNat(point[1]))
             for (var k=1;k<area.length; k++){
             var point=area[k]
             ctx.lineTo(xScaleNat(point[0]),yScaleNat(point[1]))
             }
             ctx.closePath();      // go back to point 1
             ctx.fill();
             */
        }
    }


    nGrad = nLevel
    var colorScaleGrad = d3.scaleOrdinal()
        .domain([0, nGrad - 1])
        .range(d3.schemeCategory10);

    for (var i = 0; i < nGrad; i++) {

        svG.append('rect')
            .attr('x', i / nGrad * (width - 20) + margin.left - 30)
            .attr('y', margin.top + height + 30)
            .attr('width', (width - 20) / nGrad)
            .attr('height', 10)
            .attr('stroke', 'none')
            .attr('fill', colorScaleGrad(i));
    }
    /*
     svG.append("text")
     .attr("transform",
     "translate(" + (width/2) + " ," +
     (height + margin.top + 75) + ")")
     .style("text-anchor", "small")
     .text("Value");
     */
    var [vmin,vmax,vminNat,vmaxNat,nvmax] = getMaxMin1(value)

    var valScale = d3.scaleLinear()
        .domain([vmin, vmax])
        .range([0, width - 20]);
    svG
        .append('g')
        .attr("transform", "translate(10," + (height + margin.top + 40) + ")")
        .call(d3.axisBottom(valScale));

    var vText = "VALUE (10^" + nvmax + ")"
    svG.append("text")
        .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top + 75) + ")")
        .style("text-anchor", "small")
        .text(vText);

}     // End of function


function getContour(value, coord, cell, levels) {

    var contour_lines = [],
        contour_areas = []

    function checkTriangle(levels, level_no, edges) {
        var contour = [],
            area = [],
            c = levels[level_no] + 0.000000000001

        function checkLine(c, p1, p2) {
            if ((c > Math.min(p1[2], p2[2])) && (c < Math.max(p1[2], p2[2]))) {
                var fraction = (c - p1[2]) / (p2[2] - p1[2])
                contour.push([p1[0] + fraction * (p2[0] - p1[0]), p1[1] + fraction * (p2[1] - p1[1]), c])
                area.push([p1[0] + fraction * (p2[0] - p1[0]), p1[1] + fraction * (p2[1] - p1[1]), c])
            }
            if (p2[2] > c) {
                area.push(p2)
            }
        }

        // end of checkLine

        checkLine(c, edges[0], edges[1])
        checkLine(c, edges[1], edges[2])
        checkLine(c, edges[2], edges[0])


        if (contour.length == 2) {
            contour_lines[level_no].push(contour)
        }

        if (area.length > 0) {
            contour_areas[level_no].push(area)
            if (level_no < (levels.length - 2)) {
                checkTriangle(levels, level_no + 1, edges)
            }
        }
    }

    // end of checktriangle

    for (var i = 0; i < levels.length; i++) {
        contour_areas.push([]);
        contour_lines.push([]);
    }
    for (var i = 0; i < cell.length; i++) {
        var k0 = cell[i][0], k1 = cell[i][1], k2 = cell[i][2]
        var a = [coord[k0][0], coord[k0][1], value[k0]],
            b = [coord[k1][0], coord[k1][1], value[k1]],
            c = [coord[k2][0], coord[k2][1], value[k2]],
            mX = (a[0] + b[0] + c[0]) / 3,
            mY = (a[1] + b[1] + c[1]) / 3,
            mData = (a[2] + b[2] + c[2]) / 3,
            d = [mX, mY, mData]
        checkTriangle(levels, 0, [a, b, d])
        checkTriangle(levels, 0, [d, b, c])
        checkTriangle(levels, 0, [c, a, d])
    }

    return {area: contour_areas, lines: contour_lines}
}

function getMaxMin2(data){

    //var xmin,xmax

    var xminNat=d3.min(data, d => d)
    var xmaxNat=d3.max(data, d => d)

    var nxmax,nxmin
    nxmax=0;nxmin=0
    if (xmax!=0) {
        nxmax=parseInt(Math.log10(Math.abs(xmaxNat)))
    }
    if (xmin!=0) {
        nxmin=parseInt(Math.log10(Math.abs(xminNat)))
    }
    if (nxmax<nxmin){nxmax=nxmin}

    var xmax=xmaxNat/Math.pow(10,nxmax)
    var xmin=xminNat/Math.pow(10,nxmax)

    return [xmin,xmax,xminNat,xmaxNat,nxmax]
}

