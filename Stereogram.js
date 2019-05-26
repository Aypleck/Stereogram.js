/*
==================
Autostereogram.js
==================
Autostereogram.js transform a gray scale heatmap into a 3D Autostereogram.
This library takes a map which is an ImageData object and either a autostereogram as an ImageData or as a canvas.
Note that the stereogram will always be larger than the original heightmap, because of how the illusion works.
*/

//Random pixel patterns 
//Width and height are the dimension of the pattern
//Color : the color tone of the pixels : "green", "red", "blue", or "white"
class RandomPattern {
    constructor(width, height, color) {
        this.width = Math.round(width);
        this.height = Math.round(height);
        //Check if color is valid
        var colors = ["red", "green", "blue", "white"];
        if(colors.indexOf(color) == -1){
            throw "Invalid color "+color;
        }

        //Create blank canvas
        var canvas = document.createElement("canvas");
        canvas.height = this.height;
        canvas.width = this.width;
        
        //Get blank data
        var data = canvas.getContext('2d').getImageData(0, 0, width, height)

        //Set pixels to random colors
        for(var y = 0; y < height; y++){
            for(var x = 0; x <= width; x++){
                var color = Math.round(Math.random() * 255)
                var index = 4 * (y * width + x)
                //select right color
                data.data[index    ] = (this.color == "red") ? 255 : color;
                data.data[index + 1] = (this.color == "green") ? 255 : color;
                data.data[index + 2] = (this.color == "blue") ? 255 : color;
                //always set alpha to 255
                data.data[index + 3] = 255;
            }
        }
        this.data = data;
    }
}

class Stereogram {
    //"map" is the the heightmap (an ImageData)
    //"max_height" is the maximum shift in pixels
    //"div" is the number of sections the stereogram will be splitter in
    constructor(map, max_height, div, pattern=undefined){
        this.map = map;
        this.max_height = max_height;
        this.div = div;
        if(pattern == undefined){
            this.pattern = new RandomPattern(Math.round(map.width / div), map.height, "white")
        }else {
            this.pattern = pattern; 
        }
    }

    // Generate a blank canvas with size width x height
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

    //Transform the ImageData "map" into a stereogram (ImageData)
    get_stereogram(){
        var pattern = this.pattern.data;
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

    //Get a canvas containing the stereogram
    get_canvas(){
        var stereogram_data = this.get_stereogram()
        var canvas = this.blankCanvas(stereogram_data.width, stereogram_data.height)
        this.displayData(canvas, stereogram_data)
        return canvas;
    }
}