//Extract the ImageData of the image at the directory "src", and call "callback" with the response as argument
function dataFromImage(src, callback){
    var img = new Image();
    img.src = src;
    img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img,0,0,canvas.width,canvas.height,0,0,canvas.width,canvas.height)
        var data = ctx.getImageData(0,0,canvas.width,canvas.height);
        callback(data);
    }
}

//Load image and create the stereogram with max shift 50px and 6 divisions
dataFromImage("billiard.jpg", (map) => {
    var stereogram = new Stereogram(map, 50, 6)
    var canvas = stereogram.get_canvas()
    document.body.appendChild(canvas)
})