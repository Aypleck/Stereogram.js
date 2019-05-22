# Stereogram.js
Generate Autostereograms based on a gray scale heightmap.

# How to use
You can directly use this by including the Stereogram.js file in your projects
```html
<script src="Stereogram.js"></script>
```

You can create a stereogram by initializing a `Stereogram` object
```javascript
var stereogram = new Stereogram(map_data, max_pixel_shifting, divisions)
```

and calling the methods `get_canvas()` or `get_stereogram()`.
* `get_stereogram()` : It will retrun an ImageData containing the pixels of your stereogram.
* `get_canvas()` : It will retrun an canvas containing the pixels of your stereogram.
