
//XHR to get the JSON file
let req = new XMLHttpRequest()
req.open('GET', './resources/json/GDP-data.json', true)
req.send()
req.onload = function () {
  //parse file into useable array
  let json = JSON.parse(req.responseText)
  //set the data to a variable
  let dataset = json.data
  //call render function with the dataset
  render(dataset)

}

// d3.json('/resources/json/GDP-data.json').then(data=>{
//   render(data)
// });

//render function does all the rendering of elements via d3
function render(data) {

  //create variables containing the width and height
  //set to the users display
  const width = document.body.clientWidth
  const height = document.body.clientHeight

  //create the main svg element to append our bar chart to
  const svg = d3.select('body')
    .append('svg')
    //make the width change based on width of users client width
    .attr('width', width)
    .attr('height', height)
    .attr('id', 'chart')


  //xValue variable splits the date in the json file and gets the year and month 
  //and adds them together
  const xValue = d => +d[0].split('-')[0] + +d[0].split('-')[1] / 12
  //yValue is the GDP of the dataset
  const yValue = d => d[1]

  //create a margin object to easily change margin of chart
  const margin = {
    top: 80,
    bottom: 160,
    left: 100,
    right: 40
  }

  //variable for the innerWidth and innerHeight where the bar graph is appended
  const innerWidth = width - (margin.left + margin.right)
  const innerHeight = height - (margin.top + margin.bottom)

  //format the xAxis into NO FORMATTING for years
  const xAxisTickFormat = number => d3.format("")(number)
  //format the yAxis for GDP
  const yAxisTickFormat = number => d3.format(',.2r')(number)

  //create the scale for use on x-axis elements
  const xScale = d3.scaleLinear()
    //domain is smallest and largest dataset points 
    //used the extent method to get the lowest and highest values
    .domain(d3.extent(data, xValue))
    //range is the size of the svg area we want to append too
    .range([0, innerWidth])

  //create the scale for use on y-axis elements
  const yScale = d3.scaleLinear()
    //domain is smallest and largest dataset points
    .domain([d3.max(data, yValue), 0])
    //range is the size of the svg area we want to append too
    .range([innerHeight, 0])

  // create the scale for use on y-axis bar
  // had to create seperate one to change order of tick numbers
  const yScaleAxis = d3.scaleLinear()
    .domain([d3.max(data, yValue), 0])
    .range([0, innerHeight])

  //create the xAxis
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(xAxisTickFormat)

  //create the yAxis
  const yAxis = d3.axisLeft(yScaleAxis)
    .tickFormat(yAxisTickFormat)
    //creates lines across chart
    .tickSize(-innerWidth)

  //create a new group element to append our chart items to
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  //create the title and append it to the group
  g.append('text')
    .text('United States GDP')
      .attr('id', 'title')
      .attr('text-anchor','middle')
      .attr('x', innerWidth/2)
      .attr('y', -20)

  //create a group item to create the xAxis
  g.append('g').call(xAxis)
      .attr('id', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
    .selectAll('.domain')
    .remove()

  //create a group item to create the yAxis
  g.append('g').call(yAxis)
      .attr('id', 'y-axis')

  //create text on left side of chart
  g.append('text')
    .text('Gross Domestic Product')
      .attr('id', 'GDP')
      .attr('text-anchor', 'middle')
      .attr('x', -innerHeight / 2)
      .attr('y', 30)
      .attr('transform', `rotate(-90)`)
    .append('tspan')
      .text('Units: Billions of Dollars')
      .attr('text-anchor', 'middle')
      .attr('x', -innerHeight / 2)
      .attr('y', 55)

  //create the text at bottom of chart
  g.append('text')
    .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
      .attr('id', 'moreInfo')
      .attr('x', innerWidth - 520)
      .attr('y', innerHeight + 60)

  //create all the bars for the data points
  g.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
      .attr('class', 'bar')
      //place each item based on the xScale
      .attr('x', d => xScale(xValue(d)))
      //place the item on y-axis based on the innerHeight - item passed through yScale
      .attr('y', d => innerHeight - yScale(yValue(d)))
      .attr('width', innerWidth / data.length)
      //set height of each item to avaiable scaling
      .attr('height', d => yScale(yValue(d)))
      //set data-date to date value of each data point
      .attr('data-date', d => d[0])
      //set data-gdp to gdp value of each data point
      .attr('data-gdp', d => yValue(d))
      //create title element to appear on hover
    .append('title')
      .attr('id', 'tooltip')
      //set data-date to date value of each data point
      .attr('data-date', d => d[0])
      //display Date and GDP of each element upon hover
    .text(d => { return "Date: " + d[0] + " GDP:" + yValue(d) })

}

