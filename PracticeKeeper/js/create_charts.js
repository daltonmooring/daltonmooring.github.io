//global variables
var grad_start = "FF934B";
var grad_end = "FF5BDB";
var cal_color = "FF934B"
var chart_data  = load_data();
var canvases = [];
// data needed to make bar graph
var bar_graph_data;
var bar_graph_labels;
var bar_graph_title;
var bar_graph_gradient;
var bar_config;
var bar_ctx;
var my_bar;

// data needed to make pie graph
var pie_graph_data;
var pie_graph_labels;
var pie_graph_title;
var pie_graph_gradient;
var pie_config;
var pie_ctx;
var my_pie;

// data needed to make doughnut graph
var doughnut_graph_data;
var doughnut_graph_labels;
var doughnut_graph_title;
var doughnut_graph_gradient;
var doughnut_config;
var doughnut_ctx;
var my_doughnut;

// data needed to make calendar
var num_colors
var color
var colors

var first_day
var myStartYear
var myStartMonth
var myStartDay
var myStartDate

var last_day
var myEndYear
var myEndMonth
var myEndDay
var myEndDate

var heat_mapped_color_array
var cond_array

// gradients and colors needed
var pie_doughnut_gradient;

function get_page_data(){ // retrieve information about updated colors
  grad_start = $("#grad_start").val();
  grad_end   = $("#grad_end").val();
  cal_color  = $("#cal_color").val();
}

//functions to create charts on page load
function create_bar_graph(){
  bar_graph_data     = make_bar_data(chart_data);
  bar_graph_labels   = make_data_labels(chart_data);
  bar_graph_title    = chart_data.print_bar_title();
  bar_graph_gradient = generateColor(grad_start,grad_end,bar_graph_data.length);
  bar_config         = {
      type: 'bar',
      data:{
        labels: bar_graph_labels,
        datasets:[{
          data:bar_graph_data,
          backgroundColor: bar_graph_gradient
        }]
      },
      options: {
        legend:{
          display:false,
        },
        responsive: true,
        maintainAspectRatio: false,
        title:{
          display: true,
          text:bar_graph_title,
          fontColor:"black"
        }
      }
    }
  bar_ctx = document.getElementById('bar-graph').getContext("2d");
  my_bar   = new Chart(bar_ctx, bar_config);
  canvases.push(my_bar);
}


function create_doughnut_graph() {
  doughnut_chart_data  = pie_chart_data_by_time_of(chart_data);
  doughunt_graph_title = "Practice Time in Minutes";
  doughnut_colors = generateColor(grad_start,grad_end,doughnut_chart_data.length);
  doughnut_ctx    = document.getElementById("doughnut-graph").getContext('2d');
  doughnut_config = {
      type: 'doughnut',
      data: {
        labels: practice_types,
        datasets: [
          {
            backgroundColor: doughnut_colors,
            data: doughnut_chart_data
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title:{
            display:true,
            text: doughunt_graph_title,
            fontColor:"black"
          }
        }
      }
      //create the new graphs
      my_doughnut = new Chart(doughnut_ctx, doughnut_config);
      canvases.push(my_doughnut);
  }
function create_pie_graph(){
  pie_chart_data  = pie_chart_data_by_time_of(chart_data);
  pie_graph_title = "Practice Time in Minutes";
  pie_colors = generateColor(grad_start,grad_end,pie_chart_data.length);
  pie_ctx    = document.getElementById("pie-graph").getContext('2d');
  pie_config = {
      type: 'pie',
      data: {
        labels: practice_types,
        datasets: [
          {
            backgroundColor: pie_colors,
            data: pie_chart_data
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          title:{
            display:true,
            text: pie_graph_title,
            fontColor:"black"
          }
        }
      }
      //create the new graphs
      my_pie = new Chart(pie_ctx, pie_config);
      canvases.push(my_pie);
}

function create_cal(){
  num_colors = chart_data.maxTimeInDay()+1; // maximum number of minutes practiced in one day+1
  color      = cal_color;
  colors     = generateColor(color,"ECF0F1",num_colors); // gradient from first arguement to second arguement in third arguement number of colors
  //for fade from nothing make second argument white (FFFFFF)

  first_day    = chart_data.day_array[0].currentDay; // first day of practice data available
  myStartYear  = first_day.getFullYear();
  myStartMonth = first_day.getMonth();
  myStartDay   = first_day.getDate();
  myStartDate  = new Date(myStartYear, myStartMonth, myStartDay); // the js date of the first day

  last_day   = chart_data.day_array[chart_data.day_array.length-1].currentDay; // last day of practice data available
  myEndYear  = last_day.getFullYear();
  myEndMonth = last_day.getMonth();
  myEndDay   = last_day.getDate();
  myEndDate  = new Date(myEndYear, myEndMonth, myEndDay); // the js date of the last day

  heat_mapped_color_array = []; // array of length chart_data.day_array.length that contains the the color of each day starting on first_day
  cond_array              = []; // array of the js dates of every day in chart data

  for(var i=0;i<chart_data.day_array.length;i++){ // iterate through all days in chart data
    var current_day       = chart_data.day_array[i];
    var current_day_mins  = current_day.total_practice_time_min; // number of minutes practiced on current day
    var currentYear       = current_day.currentDay.getFullYear();
    var currentMonth      = current_day.currentDay.getMonth();
    var currentDay        = current_day.currentDay.getDate();

    var condition = new Date(currentYear,currentMonth,currentDay).getTime();
    cond_array.push(condition);

    var heat_mapped_color = colors[current_day_mins]; // the color coorisponding to the number of minutes practiced that day
    heat_mapped_color_array.push(heat_mapped_color)
  }
  $(function() {
    $('#calendar').calendar({
      minDate: new Date(myStartDate),
      maxDate: new Date(myEndDate),
      customDayRenderer: function(element, date) {
        for(var i=0;i<cond_array.length;i++){
            if(date.getTime()==cond_array[i]){ // if day matches
              $(element).css('background-color', heat_mapped_color_array[i]); // make the day the particular color
              $(element).css('border-radius', '15px');
            }
          }
      },
    });
  });
}

// functions to redraw charts when refreshed
function refresh_all_charts(){ // a function to.... refresh all charts
  get_page_data();
  destroy_all_charts();
  create_bar_graph();
  create_doughnut_graph();
  create_pie_graph();
}

function destroy_all_charts(){
  for(var i=0;i<canvases.length;i++){ //iterate through all canvases and destroy them
    canvases[i].destroy();
  }
  canvases = []; // clear out canvas array
}

function refresh_cal(){
  get_page_data();
  document.getElementById("calendar").remove();
  $('.my-div').append('<div class="calendar" id="calendar"></div>');
  create_cal();
}
