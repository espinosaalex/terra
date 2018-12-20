var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame || window.msRequestAnimationFrame ||
              function(c) {window.setTimeout(c, 15)};
var config = {
   camera: {
    x: 0.0, y: 0.5, z: -3.0
   },
   lookat: {
    x: 0.0, y: -0.25, z: 0.5
   },
   lightDir: {
    x: 2.0, y: 2.4, z: -1.0
   },
   lightColour: {
    r: 1.6, g: 1.8, b: 2.2
   },
   surface: {
    specular: 8.0,
    specularHardness: 512.0,
    diffuse: 0.25,
    ambientFactor: 0.65
   },
   global: {
    ao: true,
    shadows: true,
    rotateWorld: true,
    antialias: "None"// None|Classic
   }
};

var pause = false;
var stats = new Stats();
var aspect, gl;
function init()
{
   document.addEventListener('keydown', function(e) {
    switch (e.keyCode)
    {
     case 27: // ESC
      pause = !pause;
      break;
    }
   }, false);

   // add GUI controls
   var mobile = (navigator.userAgent.indexOf("Android") !== -1);
   var gui = new dat.GUI();
   var panel = gui.addFolder('Camera Position');
   panel.add(config.camera, "x").min(-16.0).max(16.0).step(0.1);
   panel.add(config.camera, "y").min(-16.0).max(16.0).step(0.1);
   panel.add(config.camera, "z").min(-16.0).max(16.0).step(0.1);
   panel.open();
   panel = gui.addFolder('Camera LookAt');
   panel.add(config.lookat, "x").min(-16.0).max(16.0).step(0.1);
   panel.add(config.lookat, "y").min(-16.0).max(16.0).step(0.1);
   panel.add(config.lookat, "z").min(-16.0).max(16.0).step(0.1);
   if (!mobile) panel.open();
   panel = gui.addFolder('Light Direction');
   panel.add(config.lightDir, "x").min(-16.0).max(16.0).step(0.1);
   panel.add(config.lightDir, "y").min(-16.0).max(16.0).step(0.1);
   panel.add(config.lightDir, "z").min(-16.0).max(16.0).step(0.1);
   //if (!mobile) panel.open();
   panel = gui.addFolder('Light Colour');
   panel.add(config.lightColour, "r").min(0.0).max(3.0).step(0.1);
   panel.add(config.lightColour, "g").min(0.0).max(3.0).step(0.1);
   panel.add(config.lightColour, "b").min(0.0).max(3.0).step(0.1);
   //if (!mobile) panel.open();
   panel = gui.addFolder('Surface');
   panel.add(config.surface, "specular").min(0).max(64);
   panel.add(config.surface, "specularHardness").min(16).max(1024).step(16);
   panel.add(config.surface, "diffuse").min(0).max(1).step(0.05);
   panel.add(config.surface, "ambientFactor").min(0).max(1).step(0.05);
   //panel.open();
   panel = gui.addFolder('Global');
   panel.add(config.global, "antialias", ["None", "Classic"]).name("Anti Alias");
   panel.add(config.global, "shadows").name("Shadows");
   panel.add(config.global, "ao").name("Ambient Occlusion");
   panel.add(config.global, "rotateWorld").name("Rotate World");
   if (!mobile) panel.open();

   document.body.appendChild(stats.domElement);

   // create webgl context on the canvas element
   var canvas = document.getElementById("canvas"),
     aspect = canvas.width / canvas.height;
   try
   {
    gl = canvas.getContext("experimental-webgl");
   }
   catch (e)
   {
    document.write("Whoops! No useful WEB-GL impl available. Shame on you and your browser vendor.<br>" + e.message);
    return;
   }
   gl.viewport(0, 0, canvas.width, canvas.height);
   gl.clearColor(0, 0, 0, 1);
   gl.clear(gl.COLOR_BUFFER_BIT);

   // get the vertex and fragment shader source
   var v = document.getElementById("vertex").firstChild.nodeValue;
   var f = document.getElementById("fragment").firstChild.nodeValue;

   // compile and link the shaders
   var vs = gl.createShader(gl.VERTEX_SHADER);
   gl.shaderSource(vs, v);
   gl.compileShader(vs);

   var fs = gl.createShader(gl.FRAGMENT_SHADER);
   gl.shaderSource(fs, f);
   gl.compileShader(fs);

   var program = gl.createProgram();
   gl.attachShader(program, vs);
   gl.attachShader(program, fs);
   gl.linkProgram(program);

   // debug shader compile status
   var error = false;
   if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
   {
    error = true;
    console.log(gl.getShaderInfoLog(vs));
   }

   if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
   {
    error = true;
    console.log(gl.getShaderInfoLog(fs));
   }

   if (!gl.getProgramParameter(program, gl.LINK_STATUS))
   {
    error = true;
    console.log(gl.getProgramInfoLog(program));
   }
   if (error) return;

   var firstTime = Date.now();
   (f = function() {
    if (!pause)
    {
     stats.begin();

     // create vertices to fill the canvas with a single quad
     var vertices = new Float32Array(
      [
         -1, 1*aspect, 1, 1*aspect, 1, -1*aspect,
         -1, 1*aspect, 1, -1*aspect, -1, -1*aspect
      ]);

     var vbuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
     gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

     var triCount = 2,
       numItems = vertices.length / triCount;

     gl.useProgram(program);

     var time = (Date.now() - firstTime) / 1000.0;
     program.time = gl.getUniformLocation(program, "time");
     gl.uniform1f(program.time, time);

     program.resolution = gl.getUniformLocation(program, "resolution");
     gl.uniform2f(program.resolution, canvas.width, canvas.height);

     program.cameraPos = gl.getUniformLocation(program, "cameraPos");
     gl.uniform3f(program.cameraPos, config.camera.x, config.camera.y, config.camera.z);

     program.cameraLookat = gl.getUniformLocation(program, "cameraLookat");
     gl.uniform3f(program.cameraLookat, config.lookat.x, config.lookat.y, config.lookat.z);

     program.lightDir = gl.getUniformLocation(program, "lightDir");
     // pre normalise light dir
     var x = config.lightDir.x, y = config.lightDir.y, z = config.lightDir.z;
     var len = x*x + y*y + z*z;
     len = 1.0 / Math.sqrt(len);
     gl.uniform3f(program.lightDir, config.lightDir.x*len, config.lightDir.y*len, config.lightDir.z*len);

     program.lightColour = gl.getUniformLocation(program, "lightColour");
     gl.uniform3f(program.lightColour, config.lightColour.r, config.lightColour.g, config.lightColour.b);

     program.specular = gl.getUniformLocation(program, "specular");
     gl.uniform1f(program.specular, config.surface.specular);

     program.specularHardness = gl.getUniformLocation(program, "specularHardness");
     gl.uniform1f(program.specularHardness, config.surface.specularHardness);

     program.diffuse = gl.getUniformLocation(program, "diffuse");
     gl.uniform3f(program.diffuse, config.surface.diffuse,config.surface.diffuse,config.surface.diffuse);

     program.ambientFactor = gl.getUniformLocation(program, "ambientFactor");
     gl.uniform1f(program.ambientFactor, config.surface.ambientFactor);

     program.rotateWorld = gl.getUniformLocation(program, "rotateWorld");
     gl.uniform1f(program.rotateWorld, config.global.rotateWorld);

     program.antialias = gl.getUniformLocation(program, "antialias");
     gl.uniform1f(program.antialias, (config.global.antialias === "Classic"));

     program.ao = gl.getUniformLocation(program, "ao");
     gl.uniform1f(program.ao, config.global.ao);

     program.shadows = gl.getUniformLocation(program, "shadows");
     gl.uniform1f(program.shadows, config.global.shadows);

     program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
     gl.enableVertexAttribArray(program.aVertexPosition);
     gl.vertexAttribPointer(program.aVertexPosition, triCount, gl.FLOAT, false, 0, 0);

     gl.drawArrays(gl.TRIANGLES, 0, numItems);

     stats.end();
    }
    requestAnimationFrame(f);
   })();
}
