var canvas = document.createElement('canvas')
canvas.width = 900;
canvas.height = 400;

//Stereogream canvas
var split = 6;
var render = document.createElement('canvas');
render.width = canvas.width * (1 + 1/split);
render.height = canvas.height;
//Stereogram pattern
var pattern;

document.body.appendChild(render)
// document.body.appendChild(canvas)

var ctx = canvas.getContext('2d');

const player_width = canvas.width / 20;
const player_height = canvas.height / 5;
const player_speed = 6;

var player1 = {
    x: 40,
    y: canvas.height / 2,
    score: 0
}

var player2 = {
    x: canvas.width - player1.x,
    y: canvas.height / 2,
    score: 0
}

const ball_angle = Math.PI / 2;
const ball_random = 0.3;
const ball_default_speed = 3.5;
//Pick a random last winner for the start to start the ball thowards a random player
var last_winner_id = Math.round(Math.random())

var ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speed: {
        x: 0,
        y: 0,
        magnitude: ball_default_speed
    },
    direction: 0,
    radius: 30,
    reset: function() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        console.log(last_winner_id)
        ball.direction = this.randomAngle() + (1-last_winner_id)*Math.PI;
        ball.speed.magnitude =  ball_default_speed;
    },
    randomAngle: function() {
        return (Math.round(Math.random()) * 2 - 1) * ball_angle / 2 * (Math.random() * 1-ball_random + ball_random) ;
    }
}

function move() {
    //Move ball
    ball.speed.x = ball.speed.magnitude * Math.cos(ball.direction);
    ball.speed.y = ball.speed.magnitude * Math.sin(ball.direction);

    //Collisions screen edge
	if(ball.y - ball.radius + ball.speed.y <= 0 || ball.y + ball.speed.y + ball.radius > canvas.height){
		ball.direction = -Math.PI * 2 - ball.direction
    }
    
    //collision players

    //Player 1 collision
    if(ball.x - ball.radius + ball.speed.x < player1.x + player_width / 2){
        if(ball.y + ball.speed.y > player1.y - player_height / 2 && ball.y + ball.speed.y < player1.y + player_height / 2) {
            ball.direction = -Math.PI - ball.direction;
        }else{
            last_winner_id = 1;
            ball.reset();
            player2.score++;
        }
        ball.speed.magnitude++;
    }
    //Player 2 collision
    if(ball.x + ball.radius + ball.speed.x > player2.x - player_width / 2){
        if(ball.y + ball.speed.y > player2.y - player_height / 2 && ball.y + ball.speed.y < player2.y + player_height / 2) {
            ball.direction = -Math.PI - ball.direction;
        }else{
            last_winner_id = 0;
            ball.reset();
            player1.score++;
        }
        ball.speed.magnitude++;
    }

    
    ball.x += ball.speed.x;
    ball.y += ball.speed.y;

    //Move players
    //player 1
    if(shiftPressed){
        if(player1.y - player_height / 2 - player_speed > 0){
            player1.y -= player_speed;
        }else {
            player1.y = player_height / 2
        }
    }
    if(ctrlPressed){
        if(player1.y + player_height / 2 + player_speed < canvas.height){
            player1.y += player_speed;
        }else {
            player1.y = canvas.height - player_height / 2
        }
    }

    //player 2
    if(upPressed){
        if(player2.y - player_height / 2 - player_speed > 0){
            player2.y -= player_speed;
        }else{
            player2.y = player_height / 2
        }
    }
    if(downPressed){
        if(player2.y + player_height / 2 + player_speed < canvas.height){
            player2.y += player_speed;
        }else {
            player2.y = canvas.height - player_height / 2
        }
    }
}

function display(){
    //Regenerate the pattern every 100 frames
    if(frame_count%3 == 0) {
        pattern = new RandomPattern(Math.round(canvas.width / split), render.height, "white");
    }
    //clear screen
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "white";
    
    //draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill()
    
    //Draw players
    ctx.beginPath()
    ctx.fillRect(player1.x - player_width / 2, player1.y - player_height / 2, player_width, player_height)
    ctx.fillRect(player2.x - player_width / 2, player2.y - player_height / 2, player_width, player_height)
    ctx.fill()
    
    //Draw scores
    ctx.font = "900 100px Sans-serif "
    ctx.fillText(player1.score.toString(), canvas.width / 3, 70)
    ctx.fillText(player2.score.toString(), 2*canvas.width / 3, 70)
    
    //Stereogram
    var map = ctx.getImageData(0,0,canvas.width,canvas.height);
    var stereogram = new Stereogram(map, 3, split, pattern);
    var data = stereogram.get_stereogram()
    render.getContext('2d').putImageData(data, 0, 0)
}

var frame_count = 0;
function frame() {
    move();
    display();
    requestAnimationFrame(frame);
    frame_count++;
}

//main
ball.reset()
frame()

//Controls

var ctrlPressed = false;
var shiftPressed = false;
var downPressed = false;
var upPressed = false;

document.addEventListener('keydown', (key) => {
    var code = key.keyCode;
    if(code == 16){
        shiftPressed = true;
        ctrlPressed = false;
    }
    if(code == 17) {
        ctrlPressed = true;
        shiftPressed = false;
    }
    if(code == 38){
        upPressed = true;
        downPressed = false;
    }
    if(code == 40){
        downPressed = true;
        upPressed = false;
    }
})

document.addEventListener('keyup', (key) => {
    var code = key.keyCode;
    if(code == 16){
        shiftPressed = false;
    }
    if(code == 17) {
        ctrlPressed = false;
    }
    if(code == 38){
        upPressed = false;
    }
    if(code == 40){
        downPressed = false;
    }
})