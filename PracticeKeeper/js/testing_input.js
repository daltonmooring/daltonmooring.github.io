

var str;
str = 'day month year begin end type notes\n13 july 2019 17:30 18:00 wind-ensemble hello this is a test\n15 july 2019 17:45 19:45 solo test2\n15 july 2019 20:35 22:05 solo NA\n16 july 2019 14:45 15:00 solo NA\n16 july 2019 16:30 18:10 solo NA\n16 july 2019 19:00 19:55 solo NA\n16 july 2019 20:05 20:35 solo NA\n17 july 2019 15:30 16:30 solo NA\n17 july 2019 17:10 18:15 solo NA\n17 july 2019 18:50 19:40 solo NA\n18 july 2019 16:45 17:35 solo NA\n18 july 2019 18:30 19:35 solo NA\n18 july 2019 20:50 21:50  solo NA\n19 july 2019 18:30 20:00 solo NA';

var cells= str.split('\n');
var headings = cells[0].split(/\s+/);
cells.shift()
var data =[]
for(var i=0;i<cells.length;i++){
  cells[i]=cells[i].split(/\s+/);
  var current_cell  = cells[i];
  var day   = current_cell[0]
  var month = current_cell[1]
  var year  = current_cell[2]
  var begin = current_cell[3]
  var end   = current_cell[4]
  var type  = current_cell[5]
  var current_notes ="";
  for(var j = 6;j<current_cell.length;j++){
    current_notes=current_notes+current_cell[j]+" "
  }
  cells[i][6] = current_notes.trim();
  data.push(
    {
      "day": day,
      "month":month,
      "year": year,
      "begin":begin,
      "end":end,
      "type":type,
      "notes":current_notes.trim()
    }
  );
}
console.log(headings);
console.log(cells)
console.log(data)

// json file of the form of:
// var testing_data =
// [
//   {
//     "day": 6,
//     "month": "sept",
//     "year": 2018,
//     "begin": "17:30",
//     "end": "19:30",
//     "type": "wind ensemble",
//     "notes": "NA"
//   },
//   {
//     "day": 6,
//     "month": "sept",
//     "year": 2018,
//     "begin": "17:30",
//     "end": "19:30",
//     "type": "wind ensemble",
//     "notes": "NA"
//   }
// ]

// text file of the form of:
// 13 july 2019 17:30 18:00 solo
// 15 july 2019 17:45 19:45 solo
// 15 july 2019 20:35 22:05 solo
// 16 july 2019 14:45 15:00 solo
// 16 july 2019 16:30 18:10 solo
// 16 july 2019 19:00 19:55 solo
// 16 july 2019 20:05 20:35 solo
// 17 july 2019 15:30 16:30 solo
// 17 july 2019 17:10 18:15 solo
// 17 july 2019 18:50 19:40 solo
// 18 july 2019 16:45 17:35 solo
// 18 july 2019 18:30 19:35 solo
// 18 july 2019 20:50 21:50 solo
// 19 july 2019 18:30 20:00 solo
// with newline character: "/n" at the end
