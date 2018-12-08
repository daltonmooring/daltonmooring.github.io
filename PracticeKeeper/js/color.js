function hex (current_color) {
  var s = "0123456789abcdef";
  var i = parseInt(current_color);
  if (i == 0 || isNaN (current_color))
    return "00";
  i = Math.round (Math.min (Math.max (0, i), 255));
  return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
}

function convertToHex(rgb){ // convert RGB triple to hex string
  return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

function trim(s){ // to remove "#" from hex string for conversion
  return (s.charAt(0) == '#') ? s.substring(1, 7) : s
}

function convertToRGB(hex){ // convert hex string to RGB triple
  var color = [];
  color[0] = parseInt((trim(hex)).substring (0, 2), 16);
  color[1] = parseInt((trim(hex)).substring (2, 4), 16);
  color[2] = parseInt((trim(hex)).substring (4, 6), 16);
  return color;
}

function generateColor(colorStart,colorEnd,colorCount){ // input -> start(in hex), end(in hex), number of steps
	var start = convertToRGB(colorStart); // start of gradient
	var end   = convertToRGB(colorEnd);   // end of gradient
	var len   = colorCount;               // number of colors
	var alpha = 0.0;                      // alpha blending amount

	var result = [];
	for (var i = 0; i<len; i++) {
		var current_color = [];
		alpha += (1.0/len);
		current_color[0] = start[0] * alpha + (1 - alpha) * end[0];
		current_color[1] = start[1] * alpha + (1 - alpha) * end[1];
		current_color[2] = start[2] * alpha + (1 - alpha) * end[2];
		result.push(convertToHex(current_color));
	}
  for(i=0;i<len;i++){ // add "#" to beginning of result to make color parsable
    result[i]="#"+result[i];
  }

	return result;
}
