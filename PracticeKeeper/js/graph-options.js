function generateLink(){
  var final="?d=";
  for(var i=1;i!=8;i++){
    var current= document.getElementById("checkbox"+i).checked;
    if(current===true) final+="1";
    if (current===false) final+="0";
  }
  final+="&c1="+document.getElementById("color1").value;
  final+="&c2="+document.getElementById("color2").value;
  final+="&p="+ $('#slider').slider("option", "value");
  return final;
}

var $slider = $("#slider");
  if ($slider.length > 0) {
    $slider.slider({
      min: 0,
      max: 5,
      value: 3,
      orientation: "horizontal",
      range: "min"
    });
  }
  var num_circles = 20;
  function default_gradient(){ //creating defeault gradent
    var color1 = $("#color1").val();
    var color2 = $("#color2").val();
    var color_array=generateColor(color2,color1,num_circles+1);
    for (var i = 0; i < num_circles; i++) {
      $('.gradient').append('<div id="circle-' + i + '"class="circle"</div>');
      document.getElementById("circle-"+i).style.backgroundColor = color_array[i];
    }
    $('.gradient').append('<br>');
  }
  function display_grad(){
    var color1 = $("#color1").val();
    var color2 = $("#color2").val();
    var color_array=generateColor(color2,color1,num_circles+1);
    for (var i = 0; i < num_circles; i++) {
      document.getElementById("circle-"+i).style.backgroundColor = color_array[i];
    }
  }
