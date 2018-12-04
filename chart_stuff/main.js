function load_data(){
  var local_data   = data; // declared in data.json
  var all_sessions = [];
  for (var i = 0; i < local_data.length; i++) { // loop through all json entries
    var current_day     = local_data[i]; // complete entry
    var year            = parseInt(current_day.year,10);
    var month           = current_day.month;
    var day             = parseInt(current_day.day,10);
    var hour_start      = parseInt(current_day.begin.slice(0,2),10);
    var minutes_start   = parseInt(current_day.begin.slice(3,5),10);
    var hour_end        = parseInt(current_day.end.slice(0,2),10);
    var minutes_end     = parseInt(current_day.end.slice(3,5),10);
    var type            = current_day.type;
    month               = month_to_num(month);
    // using parseInt to convert json info from string to number, second arguemnt is base of number system (radix)
    var session_start   = new Date(year,month,day,hour_start,minutes_start);
    var session_end     = new Date(year,month,day,hour_end,minutes_end);
    var current_session = new session(session_start,session_end,type);
    all_sessions.push(current_session);
  }
  var result       = [];
  var start_date   = all_sessions[0].start;
  var last_session = all_sessions[all_sessions.length-1];
  var day          = new Date(start_date.getFullYear(), start_date.getMonth(), start_date.getDate());

  var i = 0;   // position in all_session
  while(true){ // while not at the end of the inputted sessions
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate()+i);
    var session_array = [];
    var test_day = new day_class(nextDay,session_array);
    result.push(test_day);
    if(nextDay.getDate()===last_session.day && nextDay.getMonth()===last_session.month && nextDay.getFullYear()===last_session.year){
      break;
    }
    i++;
  }

  var i =0;
  var j =0;
  while(true){ //loop through all sessions
    var current_day = result[i];
    var current_day_number = result[i].currentDay.getDate();
    var current_day_month  = result[i].currentDay.getMonth();
    var current_day_year   = result[i].currentDay.getFullYear();
    var current_session    = all_sessions[j];
    if (current_session.day===current_day_number && current_session.month===current_day_month && current_session.year===current_day_year){
      result[i].add_session(current_session);
      j++;
    }
    else i++;

    if (j===all_sessions.length || i===result.length){ //if at the end of either of the arrays
      break;
    }
  }
  var final = new calendar(result);
  return final;
}
