/*

	-----------------------------------------------------------
	Developed by Bruna Calheiros & Pedro Galvao - New York 2013
	----------------------- justinti.me -----------------------

*/

//variables
var canvas, context;
var dateNow, h, m, s, out;
var bg, bg_select;

var myIMG = new Image();
var myIMG2 = new Image();
var myIMG_xPos = 0;
var myIMG_yPos = 0;

requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || setTimeout;


//----------------------------------------------------------------------------- createCanvas(), display();

function createCanvas() {
	//Create Canvas
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");
	context.canvas.width  = window.innerWidth;
	context.canvas.height = window.innerHeight;

	//Set background image source
	bg_select = randomRange(1,3);
	bg = "images/bg00"+bg_select+".gif";
	myIMG.src = bg;

	//Call a function to display elements on canvas
	display();

}

function display(){
	//Responsive Canvas Size
	context.canvas.width  = window.innerWidth;
	context.canvas.height = window.innerHeight;
	
	//Call Functions
	callBG();
	callTime();
	callFX();

	//Set Loop
	//setTimeout(display, 1000);
	requestAnimationFrame( display, canvas );

}

//----------------------------------------------------------------------------- callBG();

function callBG(){
	//draw image on canvas 
	context.drawImage(myIMG, myIMG_xPos, myIMG_yPos, canvas.width, canvas.height);
	//drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);
}

//----------------------------------------------------------------------------- callTime();

function callTime(){
	//Variables
	dateNow = new Date();
	h = dateNow.getHours();
	m = dateNow.getMinutes();
	s = dateNow.getSeconds();

	//Check for single characters
	if (h <= 9){
		h = "0" + h;
	}
	if (m <= 9){
		m = "0" + m;
	}
	if (s <= 9){
		s = "0" + s;
	}

	out = h + ":" + m + ":" + s;
	//Make clock responsive
	var wPos =	(canvas.width/100)*3;
	var fSize = (480)*((canvas.width-wPos*2)/(300*6));
	var hPos = ((canvas.height)/2)+(fSize/3);

	context.font = 'normal ' + fSize +'px pixbasic';
	context.fillStyle = 'white';
	context.fillText(out, wPos, hPos);

}

//----------------------------------------------------------------------------- callFX();

function callFX(){

	quad();
	color(0, canvas.width, canvas.height, 300, 250);
	color(0, canvas.width, canvas.height, 300, 250);
	
	//slash(line, stroke, offset)

	for(var m=0; m<6; m++){
	
		slash(
			randomRange(0,canvas.height*4),
			randomRange(2,60),
			-128);
		slash(
			randomRange(0,canvas.height*4),
			randomRange(2,60),
			60);

	}

	slash((canvas.height*4)/2,60,-192);

	if (randomRange(0,10)>9){
		callTime();
		pixelate(randomRange(20,30));
	}

	if (randomRange(0,10)>8){
		var s2 =30
		var w2 = (canvas.height/s2)*4;
		for(var n=0; n<w2; n++){
			var z2 = 100*n;
			slash(n*s2,s2,z2);
		}
	}
	

	pixelate(3);

	//chroma(4, 0, 0, 0, 0, 0);

}

//----------------------------------------------------------------------------- quad();

function quad(){
	myIMG2.src = bg;

	//get pixel data
	var cropW = 100;
	var cropH = 150;

	var posX = 0;
	var posY = 0;
	var scaleX = 0.25;
	var scaleY = 0.25;

	var cols = myIMG.width/(cropW*scaleX);
    var rows = myIMG.height/(cropH*scaleY);



	for(var y=0; y<rows; y++) {

		for(var x=0; x<cols; x++) {

	  		//var nX = cols/(cropW*scaleX);
	  		var cropX = randomRange(0,myIMG.width/2);
			var cropY = randomRange(0,myIMG.height/2);

	  		var cW = randomRange(0,400);
			var cH = randomRange(0,350);

	  		if (randomRange(0,10)>8){
		  		context.drawImage(myIMG2,
					cropX, cropY, cropW, cropH,
					posX+(cW*scaleX*x), posY+(cH*scaleY*y), cW*scaleX, cH*scaleY
				);
	  		}
			//console.log(x);

		}
	}

}
  
//----------------------------------------------------------------------------- pixelate();

function pixelate(pixelSize){
  	//get image data
	var  imgData = context.getImageData(0, 0, canvas.width, canvas.height); 
	//get pixel data
	var pixelData = imgData.data; //array de pixels
	var cols = imgData.width;
    var rows = imgData.height;
    //mosaic routine
	for(var y=0; y<rows; y += pixelSize) {

		for(var x=0; x<cols; x += pixelSize) {
		
			var r = pixelData[((cols * y) + x) * 4 +0];
			var g = pixelData[((cols * y) + x) * 4 +1];
			var b = pixelData[((cols * y) + x) * 4 +2];
			var a = pixelData[((cols * y) + x) * 4 +3];

			for(var n=0; n<pixelSize; n++){

				for(var m = 0; m < pixelSize; m++) {

					if(x + m < cols) {
						pixelData[((cols * (y + n)) + (x + m)) * 4 + 0] = r;
	                	pixelData[((cols * (y + n)) + (x + m)) * 4 + 1] = g;
	                	pixelData[((cols * (y + n)) + (x + m)) * 4 + 2] = b;
                	}
	            }
			}
		}
	}
	//put image dat back
	context.putImageData(imgData, 0, 0);
}
//----------------------------------------------------------------------------- slash();

function slash(line, stroke, offset){
	//get image data
	var  imgData = context.getImageData(0, 0, canvas.width, canvas.height);
	//get pixel data
	var pixelData = imgData.data;
	var alength = pixelData.length;
	//set slash variables
	var start = canvas.width*line
	var range = canvas.width*stroke;
	var myArray = new Array();
	//slash routine
	for (var j=0; j<range; j+=4){
		myArray[j] = pixelData[j+start];
		myArray[j+1] = pixelData[j+start+1];
		myArray[j+2] = pixelData[j+start+2];
		myArray[j+3] = pixelData[j+start+3];
	}

	for(var n=0; n<range; n++){
		pixelData[n+start+offset] = myArray[n];
	}
	//put image data back
	context.putImageData(imgData, 0, 0);
}
//-----------------------------------------------------------------------------	chroma();

function chroma(displace, glitch, lPos, tPos, rPos, bPos){
	//get image data
	var  imgData = context.getImageData(0, 0, canvas.width, canvas.height);
	//get pixel data
	var pixelData = imgData.data;
	var cols = canvas.width;
    var rows = canvas.height;
	
	//selection
	var lefPos = lPos;
	var topPos = tPos;
	var rigPos = rPos;
	var	botPos = bPos;
	var selWidth = canvas.width-rigPos;
	var selHeight = canvas.height-botPos;

	var selX = (cols-((canvas.width-lefPos)-selWidth));
	var selY = (rows-((canvas.height-topPos)-selHeight));
	
	//chromatic aberration routine
	for (var y = tPos; y < selY; y++) {
		
		for (var x = lPos; x < selX; x++) {

			var r = pixelData[((cols * y) + x) * 4- (glitch-1) * (displace*20)];
			var g = pixelData[((cols * y) + x) * 4 +1];
			var b = pixelData[((cols * y) + x) * 4 +2];
			var a = pixelData[((cols * y) + x) * 4 +3];
	
			var bw = r*.3 + g*.59 + b*.11;
	
			pixelData[((cols * y) + x) * 4 +0] = r;
			pixelData[((cols * y) + x) * 4 +1] = g;
			pixelData[((cols * y) + x) * 4 +2] = b;
		}
	}
	//put image data back
	context.putImageData(imgData, 0, 0);
}

//----------------------------------------------------------------------------- color();

function color(amount, maxX, maxY, maxW, maxH){
	//get image data
	var  imgData = context.getImageData(0, 0, canvas.width, canvas.height);
	//get pixel data
	var pixelData = imgData.data;
	
	var length = pixelData.length;
	var cols = canvas.width;
    var rows = canvas.height;
	
	//selection
	var boxX = randomRange(0,maxX);
	var boxY = randomRange(0,maxY);
	var lefPos = randomRange(0, boxX);
	var topPos = randomRange(0, maxY);
	var selWidth = randomRange(0, maxW);
	var selHeight = randomRange(0, maxH);;
	
	//check bounds
	if (selWidth > (canvas.width-lefPos)){
		selWidth  = canvas.width-lefPos;
	}
	if (selHeight > (canvas.height-topPos)){
		selHeight  = canvas.height-topPos;
	}
		
	
	var selX = (cols-((canvas.width-lefPos)-selWidth));
	var selY = (rows-((canvas.height-topPos)-selHeight));
	
	//Pixel Matrix
	for (var y = topPos; y < selY; y++) {
		
		for (var x = lefPos; x < selX; x++) {

			var r = pixelData[((cols * y) + x) * 4 +0];
			var g = pixelData[((cols * y) + x) * 4 +1];
			var b = pixelData[((cols * y) + x) * 4 +2];
			var a = pixelData[((cols * y) + x) * 4 +3];
	
			var bw = r*.3 + g*.59 + b*.11;

		switch(bg_select)
		{
		case 1:
		  r = 0;
		  g = bw;
		  b = 255;
		  break;
		case 2:
		  r = bw;
		  g = 50;
		  b = 0;
		  break;
		case 3:
		  r = 200;
		  g = 0;
		  b = bw;
		}
	
			pixelData[((cols * y) + x) * 4 +0] = r;
			pixelData[((cols * y) + x) * 4 +1] = g;
			pixelData[((cols * y) + x) * 4 +2] = b;
		};
	};
  
	//put image data back
	context.putImageData(imgData, 0, 0);
}

//----------------------------------------------------------------------------- randomRange();


function randomRange(minValue, maxValue){
	var vMin = minValue;
	var vMax = maxValue;
	
	return Math.floor((Math.random()*vMax)+vMin);
}