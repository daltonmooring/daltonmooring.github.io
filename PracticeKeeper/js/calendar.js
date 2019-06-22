var short_months_lc     = ["jan","feb","mar","apr","may","june","jul","aug","sept","oct","nov","dec"]
var short_months_uc     = ["Jan","Feb","Mar","Apr","May","June","Jul","Aug","Sept","Oct","Nov","Dec"]
var practice_types      = ["solo","wind ensemble","orchestra","lesson","sectional","performance","chamber"]
var long_months         = ["January","February","March","April","May","June","July","August","September","October","November","December"]
var weekdays            = ["Sunady","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

// helper functions
function month_to_num(month){ // converts a string month into a 0-11 number for the date object
  month = month.toLowerCase();
  for(var i =0;i<short_months_lc.length;i++){
    if (month===short_months_lc[i]){
      return i;
    }
  }
}
function num_to_month(month){ // converts a month from a 0-11 number to a string for printing
  for(var i =0;i<short_months_uc.length;i++){
    if (month===i){
      return short_months_uc[i];
    }
  }
}
function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}
function random_cal_set_of_size(n){
  var day = new Date(2017,11,31);
  var day_array = [];
  for(var j=1;j<=n;j++){ //for a week
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate()+j);
    var session_array = [];
    var num_sessions_per_day = Math.floor((Math.random() * 4));
    for(var a=0;a<num_sessions_per_day;a++){ //for a randomly generated number of sessions per day
      var session_start = new Date(nextDay);
      var session_end   = new Date(nextDay);

      var rand_start_hour = Math.floor(Math.random() * 23);
      var rand_end_hour   = rand_start_hour+ Math.floor(Math.random() * 3);

      var rand_start_min  = Math.floor(Math.random() * 59);
      var rand_end_min    = Math.floor(Math.random() * 59);
      if(rand_start_hour===rand_end_hour){
        if(rand_start_min>rand_end_min){
          var temp1      = rand_start_min;
          var temp2      = rand_end_min;
          rand_end_min   = temp1;
          rand_start_min = temp2;
        }
      }
      session_start.setHours(rand_start_hour);
      session_start.setMinutes(rand_start_min);
      session_end.setHours(rand_end_hour);
      session_end.setMinutes(rand_end_min);

      var rand_type    = practice_types[Math.floor((Math.random() * 6))];
      var temp_session = new session(session_start,session_end,rand_type);
      session_array.push(temp_session);
    }
    var test_day = new day_class(nextDay,session_array);
    day_array.push(test_day);
  }
  var new_cal = new calendar(day_array);
  return new_cal;
}

// bar graph data

function make_bar_data_hour(cal,precision){ // makes a coorisponding y value for the data labels
  var data_set = [];
  for(var i =0;i<cal.day_array.length;i++){
    var time = round(cal.day_array[i].total_practice_time_min/60,precision);
    data_set.push(time.toPrecision(4));
  }
  return data_set;
}
function make_data_labels(cal){ //makes labels for an inputted calendar
  var data_set = [];
  for(var i =0;i<cal.day_array.length;i++){
    data_set.push(cal.day_array[i].short_print());
  }
  return data_set;
}

// pie chart data
function pie_chart_data_by_time_of_hour(cal){ //returns TIME of solo, wind ensemble, orchestra, private lesson, sectionals for a given calender in hours
  var data_set = [];
  for(var i=0;i<practice_types.length;i++){
    data_set.push(0);
  }
  for(var i =0;i<cal.day_array.length;i++){
    for (var j =0;j<cal.day_array[i].sessions.length;j++){
      for(var k=0;k<practice_types.length;k++){
        if (cal.day_array[i].sessions[j].practice_type===practice_types[k]){
          var time_in_hours= cal.day_array[i].sessions[j].length_min/60;
          data_set[k]+=time_in_hours;
        }
      }
    }
  }
  for(var i=0;i<data_set.length;i++){
    var new_data = round(data_set[i],0);
    data_set[i] =new_data;
  }
  return data_set;
}

// classes
class calendar{
  constructor(day_array){ //should take in array of days
    this.day_array  = day_array;
    this.length     = this.day_array.length;
    this.firstDay   = day_array[0];
    this.lastDay    = day_array[this.length-1];
  }
  print(){
    var text="";
    text+="This calendar has "+(this.day_array.length)+" days\n";
    for(var i =0;i<this.day_array.length;i++){
      text+=this.day_array[i].print();
    }
    return text;
  }
  print_bar_title_minutes(){
    var text="";
    text+="Practice time per day in minutes from ";
    text+=this.firstDay.short_print_w_year()+" to ";
    text+=this.lastDay.short_print_w_year();
    return text;
  }
  print_bar_title_hours(){
    var text="";
    text+="Practice time per day in hours from ";
    text+=this.firstDay.short_print_w_year()+" to ";
    text+=this.lastDay.short_print_w_year();
    return text;
  }
  print_generic_title(){
    var text="";
    text+="Practice Time In Hours From ";
    text+=this.firstDay.short_print_w_year()+" to ";
    text+=this.lastDay.short_print_w_year();
    return text;
  }
  maxTimeInDay(){
    var max = 0;
    for(var i=0;i<this.day_array.length;i++){
      if (this.day_array[i].total_practice_time_min>max){
        max = this.day_array[i].total_practice_time_min;
      }
    }
    return max;
  }
}
class day_class{
  constructor(day, sessions){ // should take in new date object of midnight of the day and array of practice session
    this.currentDay = day;
    this.sessions   = sessions;
    var total_practice_time_ms  = 0;
    var total_practice_time_min = 0;
    for(var i =0;i<sessions.length;i++){ // loop through all sessions and calculate total practice time
      total_practice_time_ms  += this.sessions[i].length_ms;
      total_practice_time_min += this.sessions[i].length_min;
    }
    this.total_practice_time_ms  = total_practice_time_ms;
    this.total_practice_time_min = total_practice_time_min;
  }
  add_session(session){
    this.sessions.push(session);
    this.total_practice_time_ms  += session.length_ms;
    this.total_practice_time_min += session.length_min;
  }
  print(){
    var text="";
    var current_month = long_months[this.currentDay.getMonth()];
    var current_day = this.currentDay.getDate();
    var current_weekday = weekdays[this.currentDay.getDay()];
    var current_year= this.currentDay.getFullYear();
    text+="On "+current_weekday+", the "+ordinal_suffix_of(current_day)+" of "+current_month+" in "+current_year;
    if(this.sessions.length===0){ // if no practice sessions
      text+=" there were no practice sessions.\n"
    }
    else{
      var num_practice_sessions=this.sessions.length;
      text+=" there were "+(num_practice_sessions)+" practice sessions.\n";
      var i;
      for (var i = 0; i <num_practice_sessions; i++) {
        text+="Practice session "+(i+1)+".\n";
        text+=this.sessions[i].print();
      }
    }
    text+="\ntotal practice time for today: "+this.total_practice_time_min+" minutes\n";
    text+="-----------------------------------------------------------\n";

    return text;
  }
  short_print(){
    var text="";
    var month = this.currentDay.getMonth();
    var day = this.currentDay.getDate();
    month = num_to_month(month);
    text+=month+" "+day;
    return text;
  }
  short_print_w_year(){
    var text="";
    var month = this.currentDay.getMonth();
    var day = this.currentDay.getDate();
    var year = this.currentDay.getFullYear();

    month = num_to_month(month);
    text+=month+" "+day+" "+year;
    return text;
  }



}
class session{
  constructor(time1,time2,type){ // should take in two date objects
    this.day           = time1.getDate();
    this.month         = time1.getMonth();
    this.year          = time1.getFullYear();
    this.start         = time1;
    this.end           = time2;
    this.length_ms     = time2-time1;
    this.length_min    = this.length_ms/ 60000;
    this.practice_type = type;
  }
  print(){
    var return_string = "";
    var hour_start    = this.start.getHours();
    var hour_end      = this.end.getHours();
    var min_start     = this.start.getMinutes();
    if(min_start<10){
      min_start="0"+min_start;
    }
    var min_end = this.end.getMinutes();
    if(min_end<10){
      min_end="0"+min_end;
    }

    return_string+="Day is "+this.day+"\n";
    if (hour_start>12 && hour_end>12) { //if both in PM
      hour_start = hour_start-12;
      hour_end   = hour_end-12;
      var full_start = hour_start + ":" + min_start + "PM ";
      var full_end   = hour_end   + ":" + min_end   + "PM";
    }

    else if (hour_start===12&&hour_end>12) { //if start at 12 something and end in PM
      hour_start = 12;
      hour_end   = hour_end-12;
      var full_start = hour_start + ":" + min_start+"PM ";
      var full_end   = hour_end   + ":" + min_end+"PM";
    }

    else if (hour_start<12&&hour_end>12) { //if start in AM and end in PM
      hour_end = hour_end-12;
      var full_start = hour_start + ":" + min_start + "AM ";
      var full_end   = hour_end   + ":" + min_end   + "PM";
    }

    else if (hour_start<12&&hour_end===12) { //if start in AM and ends at 12 something
      hour_end=12;
      var full_start = hour_start + ":" + min_start + "AM ";
      var full_end   = hour_end   + ":" + min_end   + "PM";

    }
    else{  // else both in AM
      var full_start = hour_start + ":" + min_start + "AM ";
      var full_end   = hour_end   + ":" + min_end   + "AM";
    }

    return_string+= "This practice session started at "+full_start+"and ended at "+full_end;
    return_string+= "\ntime eplased: "+this.length_min+" minutes\n";
    return_string+= "type: "+this.practice_type+"\n\n";
    return return_string;

  }
}
