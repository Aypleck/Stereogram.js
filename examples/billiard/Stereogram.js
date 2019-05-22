/*
==================
Autostereogram.js
==================
Autostereogram.js transform a gray scale heatmap into a 3D Autostereogram.
This library takes a map which is an ImageData object and either a autostereogram as an ImageData or as a canvas.
Note that the stereogram will always be larger than the original heightmap, because of how the illusion works.
*/

class Stereogram {
    //"map_dir" is the directory of the heightmap
    //"max_height" is the maximum shift in pixels
    //"div" is the number of sections the stereogram will be splitter in
    constructor(map, max_height, div, pattern_dir=undefined){
        this.map = map;
        this.max_height = max_height;
        this.div = div;
        this.pattern_dir = pattern_dir
    }

    //Generate a blank canvas with size width x height
    blankCanvas(width, height){
        var canvas = document.createElement("canvas");
        canvas.height = height;
        canvas.width = width;
        return canvas
    }

    //Generate a blank ImageData with size width x height
    blankData(width, height) {
        var canvas = this.blankCanvas(width, height)
        var data = canvas.getContext('2d').getImageData(0, 0, width, height)
        return data;
    }
    
    //display the ImageData "data" on the canvas "canvas"
    displayData(canvas, data){
        var ctx = canvas.getContext('2d');
        ctx.webkitImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        ctx.putImageData(data, 0, 0)
        ctx.drawImage(canvas, 0, 0, data.width, data.height, 0, 0, canvas.width, canvas.height)
    }


    //Generate a random noise ImageData with size width x height
    randomData(width, height){
        var data = this.blankData(width, height)
        for(var y = 0; y < height; y++){
            for(var x = 0; x <= width; x++){
                var color = Math.round(Math.random() * 255)
                // var color = Math.round(x / width * 255) 
                // var color = (x < 1) ? 0 : 255;
                // var color = 0;
                var index = 4 * (y * width + x)
                data.data[index] = color;
                data.data[index + 1] = color;
                data.data[index + 2] = color;
                data.data[index + 3] = 255;
            }
        }
        return data
    }

    //Get a pattern that is a column of size div/stereogram.width

    //Transform the ImageData "map" into a stereogram (ImageData)
    make_stereogram(){
        //Get the pattern (some random gray-scale pixels)
        var pattern = this.randomData(Math.round(this.map.width / this.div), this.map.height)
        //Make the stereogram ImageData
        var stereogram = this.blankData(this.map.width + pattern.width-1, this.map.height);
        //For every pixels of the stereogram
        for(var y = 0; y < stereogram.height; y++){
            for(var x = 0; x < stereogram.width; x++){
                //Index of the current pixel of the stereogram
                var index = 4*(y * stereogram.width + x)
                
                //If we are in the first div, just draw the pattern
                if(x < pattern.width){
                    //Take the pixel at that index on the pattern
                    new_pixel_index = (x + y * pattern.width) * 4
                    //Draw the pixel
                    stereogram.data[index] = pattern.data[new_pixel_index]
                    stereogram.data[index + 1] = pattern.data[new_pixel_index + 1]
                    stereogram.data[index + 2] = pattern.data[new_pixel_index + 2]
                    stereogram.data[index + 3] = pattern.data[new_pixel_index + 3]
                
                //Draw the previous div but shifted by the amout of white on the heightmap
                }else{
                    //Get the index of the pixel on the heightmap corresponding to the pixel on the stereogram
                    var depht_pixel_index = 4*(y * this.map.width + x - pattern.width)
                    //A scalar between 0 and 1 : 0 = no shift, 1 = max shift
                    var depth = (this.map.data[depht_pixel_index] / 255)
                    //The amout of pixels to shift
                    var shift = Math.floor(depth * this.max_height);
                    //We take the current index (x + y * width) but remove the width of a pattern to the x value to get the value of the previous column
                    //Then take the pixel "shift" pixels to the right
                    var new_pixel_index = (x - pattern.width + shift + y * stereogram.width) * 4

                    //Draw the pixel
                    stereogram.data[index] = stereogram.data[new_pixel_index]
                    stereogram.data[index + 1] = stereogram.data[new_pixel_index + 1]
                    stereogram.data[index + 2] = stereogram.data[new_pixel_index + 2]
                    stereogram.data[index + 3] = stereogram.data[new_pixel_index + 3]
                    if(x>stereogram.width - pattern.width){
                        
                    }
                }
    
            }
        }
        return stereogram
    }

    //Get the ImageData value of the stereogram
    get_image_data() {
        var stereogram = this.make_stereogram();
        return stereogram
    }

    //Get a canvas containing the stereogram
    get_canvas(){
        var stereogram_data = this.get_image_data()
        var canvas = this.blankCanvas(stereogram_data.width, stereogram_data.height)
        this.displayData(canvas, stereogram_data)
        return canvas;
    }
}