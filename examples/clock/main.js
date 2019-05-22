//Create the canvas
var canvas = document.createElement("canvas");
canvas.width = 1000;
canvas.height = 400;

//Set the font
var ctx = canvas.getContext('2d');
ctx.font = 'bold 225px sans-serif';
ctx.textAlign = "center"

//Display a stereogram with the text "String"
function text(string){
    //Create the map
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,canvas.width,canvas.height)                    //Clear canvas
    ctx.fillStyle = "white"
    ctx.fillText(string, canvas.width/2, canvas.height / 2 + 80);
    var map = ctx.getImageData(0,0,canvas.width,canvas.height)
    //Create stereogram
    var stereogram = new Stereogram(map, 5, 7)
    var stereogram_canvas = stereogram.get_canvas()
    //Display stereogram
    //Clear old canvas
    document.body.innerHTML = ""
    //Add new canvas
    document.body.appendChild(stereogram_canvas)
}

//Get the time and display it every seconds
setInterval(()=>{
    text(Date().split(" ")[4])
}, 1000);