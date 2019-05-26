var canvas = document.createElement("canvas");
canvas.width = 700;
canvas.height = canvas.width * 3/4;
var ctx = canvas.getContext('2d');

var img = document.createElement('img')
img.src = "logo.png"

var img_size = 1/2.5

var speed = 15;
var direction = 0.23 * Math.PI;
var speed_x = 0;
var speed_y = 0;
var x = 0;
var y = 0;

var last_time = undefined;


function dvd(dt) {
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvas.width, canvas.height)
	ctx.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * img_size, img.height * img_size)
	
	if(x + speed_x <= 0){
		direction = -Math.PI - direction
		direction -= Math.random() * Math.PI / 16
	}else if(x + speed_x + img.width * img_size > canvas.width){
		direction = -Math.PI - direction
		direction += Math.random() * Math.PI / 16
	}

	if(y + speed_y <= 0){
		direction = -Math.PI * 2 - direction
		direction -= Math.random() * Math.PI / 16
	}else if (y + speed_y + img.height * img_size > canvas.height){
		direction = -Math.PI * 2 - direction
		direction += Math.random() * Math.PI / 16
	}

	speed_x = speed * Math.cos(direction) * dt;
	speed_y = speed * Math.sin(direction) * dt;



	x += speed_x;
	y += speed_y;
}



//Autostereogram
var splits = 6;
var render = document.createElement("canvas")
render.width = Math.round(canvas.width * (1 + 1/splits));
render.height = canvas.height;
document.body.appendChild(render)
var render_ctx = render.getContext('2d');

function frame(time) {
	if(last_time == undefined){
		last_time = time;
		var dt = 0
	}else {
		var dt = (time - last_time) / 100;
	}
	dvd(dt);
	var dvd_data = ctx.getImageData(0,0,canvas.width,canvas.height)
	var stereogram = new Stereogram(dvd_data, 7, splits, pattern_dir=undefined, color="blue")
	var stereogram_data = stereogram.get_stereogram();
	render_ctx.putImageData(stereogram_data, 0, 0)

	last_time = time;
	requestAnimationFrame(frame)
}


img.onload = () => {
	frame();
}