
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    snapshotButton = document.getElementById('snapshotButton'),
    snapshotImageElement = document.getElementById('snapshotImageElement'),
    FONT_HEIGHT = 18,
    MARGIN = 35,
    HAND_TRUNCATION = canvas.width/25,
    HOUR_HAND_TRUNCATION = canvas.width/10,
    NUMERAL_SPACING = 10,
    RADIUS = canvas.width/2,
    HAND_RADIUS = RADIUS - NUMERAL_SPACING,
    loop;

// Functions.....................................................

function drawCircle() {
   context.save();
   context.lineWidth = 5;
   context.strokeStyle = "#fff";
   context.beginPath();
   context.arc(canvas.width/2, canvas.height/2, RADIUS, 0, Math.PI*2, true);
   context.stroke();
   context.restore();
}
   
function drawNumerals() {
   var numerals = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ],
       angle = 0,
       numeralWidth = 0;
   context.save();
   context.translate(canvas.width/2, canvas.height/2);
   context.textAlign = 'center';
   context.textBaseline = 'middle';
   numerals.forEach(function(numeral) {
      angle = Math.PI/6 * (numeral-3);
      numeralWidth = context.measureText(numeral).width;
      /*context.fillText(numeral, 
         canvas.width/2  + Math.cos(angle)*(HAND_RADIUS) - numeralWidth/2,
         canvas.height/2 + Math.sin(angle)*(HAND_RADIUS) - FONT_HEIGHT/2);*/
        
         context.fillText(numeral, 
         Math.cos(angle)*(RADIUS)*0.7,
        Math.sin(angle)*(RADIUS)*0.7);
   });
   context.restore();
}

function drawCenter() {
   context.beginPath();
   context.fillStyle = "#000";
   context.arc(canvas.width/2, canvas.height/2, 6, 0, Math.PI*2, true);
   context.fill();
}

function drawHand(loc, type) {
   var angle = (Math.PI*2) * (loc/60) - Math.PI/2,
       handRadius;
   context.save();
   context.beginPath();
   if(type == "H"){
      context.strokeStyle ="#000";
      context.lineWidth =5;
      handRadius = RADIUS*0.6;
      context.moveTo(canvas.width/2, canvas.height/2);
      context.lineTo(canvas.width/2  + Math.cos(angle)*handRadius, 
                    canvas.height/2 + Math.sin(angle)*handRadius);
      context.stroke();
   }else if(type == "M"){
      context.strokeStyle ="#333";
      context.lineWidth =4;
      handRadius = RADIUS*0.7;
      context.moveTo(canvas.width/2-10*Math.cos(angle), canvas.height/2 -10*Math.sin(angle));
      context.lineTo(canvas.width/2  + Math.cos(angle)*handRadius, 
                    canvas.height/2 + Math.sin(angle)*handRadius);
      context.stroke();
   }else{

      context.strokeStyle ="#f00";
      context.lineWidth =3;
      handRadius = RADIUS*0.8;
      context.moveTo(canvas.width/2-16*Math.cos(angle), canvas.height/2 -16*Math.sin(angle));
      context.lineTo(canvas.width/2  + Math.cos(angle)*handRadius, 
                    canvas.height/2 + Math.sin(angle)*handRadius);
      context.stroke();
   }
    context.closePath();
    context.restore(); 
}

function drawHands() {
   var date = new Date,
       hour = date.getHours();
   hour = hour > 12 ? hour - 12 : hour;
   drawHand(hour*5 + (date.getMinutes()/60)*5, "H");
   drawHand(date.getMinutes(), "M");
   drawHand(date.getSeconds(), "S");
}

function updateClockImage() {
   dataUrl = canvas.toDataURL();
   snapshotImageElement.src = dataUrl;
}

function drawMark(){
  //时刻度
  for(var i=0;i<12;i++){
    context.save();
    context.lineWidth =6;
    context.strokeStyle ="#000";

    context.translate(canvas.width/2,canvas.height/2);

    context.rotate(30*i*Math.PI/180);
    context.beginPath();
    context.moveTo(0, RADIUS-3);
    context.lineTo(0, RADIUS-13);
    context.stroke();
    context.closePath();
    context.restore();
  }

  //分刻度
  for(var i=0;i<60;i++){
    context.save();
    context.lineWidth =2;
    context.strokeStyle ="#000";

    context.translate(canvas.width/2,canvas.height/2);

    context.rotate(6*i*Math.PI/180);
    context.beginPath();
    context.moveTo(0, RADIUS-3);
    context.lineTo(0, RADIUS-8);
    context.stroke();
    context.closePath();
    context.restore();
  }
}

function drawClock() {
   context.clearRect(0,0,canvas.width,canvas.height);

   context.save();

   context.fillStyle = 'rgba(255,255,255,0.8)';
   context.fillRect(0, 0, canvas.width, canvas.height);

   drawCircle();
   drawHands();
   drawMark();
   drawCenter();

   context.restore();

   drawNumerals();

   updateClockImage();
}

// Initialization................................................

context.font = FONT_HEIGHT + 'px Arial';
loop = setInterval(drawClock, 1000);
