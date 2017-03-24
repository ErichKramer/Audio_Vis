console.log("Starting script\n");
var width = window.innerWidth;
var height = window.innerHeight;


var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene;

//define and create cube
//
var cubeGeometry = new THREE.TorusKnotGeometry(100, 20, 128, 16);
//var cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xFFE600 });

var uniforms = {
    time: { type: "f", value: 0 },
    resolution: { type: "v2", value: new THREE.Vector2 },
	freqSamp: { type: "iv1", value: []}
};

var itemMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById('cubeVertexShader').innerHTML,
    fragmentShader: document.getElementById('cubeFragmentShader').innerHTML
});

var item = new THREE.Mesh(new THREE.SphereGeometry(100, 32, 32), itemMaterial);


scene.add(item);

//define and create camera
var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);


camera.position.set(0, 350, 400);

scene.add(camera);


camera.lookAt(item.position);

//renderer.setClearColor( 0xffffff, 1); //set background to white

//Create and add skybox, large cube w/o lighting to set black backdrop
var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
 
scene.add(skybox);

var pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 300, 200);
 
scene.add(pointLight);

var clock = new THREE.Clock;

console.log("Finished creating scene\n");




//Courtesy: https://www.patrick-wied.at/blog/how-to-create-audio-visualizations-with-javascript-html
window.onload = function() {

  console.log("Entered window onload\n");
  var ctx = new AudioContext();
  var audio = document.getElementById("myAudio");
  var audioSrc = ctx.createMediaElementSource(audio);
  var analyser = ctx.createAnalyser();
  // we have to connect the MediaElementSource with the analyser 
  audioSrc.connect(analyser);
  audioSrc.connect(ctx.destination);//link audio to destination
  // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
 
  // frequencyBinCount tells you how many values you'll receive from the analyser
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);
 
  // we're ready to receive some data!
  // loop
	var x = 0;
	analyser.getByteFrequencyData(frequencyData);
	uniforms.freqSamp.value = frequencyData;


	function render() {
	    renderer.render(scene, camera);
		//everything here will run for each frame
	//  item.rotation.y -= clock.getDelta();
	//	item.rotation.x = Math.abs(Math.sin(2*clock.getElapsedTime())/2.);
		uniforms.time.value = Math.sin(clock.getElapsedTime());

		//grab freq data and pass into shaders
	    analyser.getByteFrequencyData(frequencyData);
		uniforms.freqSamp.value = frequencyData;

		//console.log(frequencyData);/*DEBUG*/
		
	    requestAnimationFrame(render);
	}

	audio.play();
 
	render();

};


//render loop






