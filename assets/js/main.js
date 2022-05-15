let camera, scene, renderer;
let sigil;

let cameraFav, rendererFav;

var render = true;
var doFavicon = localStorage.getItem("doFavicon")=="true";

function isWebGLAvailable() {
	try {
		const canvas = document.createElement('canvas');
		return !! (window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
	} catch (e) {
		return false;
	}
}

function degToRad(deg) {
	return deg*Math.PI/180
}

if (isWebGLAvailable()) {
	init();
} else {
	const element = document.createElement('p');
	element.innerHTML = "hi";
	document.body.appendChild(element);
	document.body.style.margin = "8px"
}

function init() {

	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 2, 7);
	camera.position.z = 3;

	cameraFav = new THREE.PerspectiveCamera(40, 1, 2, 5);
	cameraFav.position.z = 3;

	scene = new THREE.Scene();
	//scene.background = new THREE.Color(0x404040);
	
	const light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 0, 1 );
	scene.add(light);


	sigil = new THREE.Group()
	scene.add(sigil);

	let shard1Material = new THREE.MeshPhongMaterial({
		color: 0x00ff00,
		flatShading: true,
		shininess: 0
	});
	let shard2Material = new THREE.MeshPhongMaterial({
		color: 0x0000ff,
		flatShading: false,
		shininess: 0
	});
	let shard3Material = new THREE.MeshPhongMaterial({
		color: 0xff0000,
		flatShading: true,
		shininess: 0
	});

	let shard1Geometry = new THREE.BoxGeometry(0.52, 0.1, 0.52);
	let shard2Geometry = new THREE.CylinderGeometry(0.26, 0.26, 0.1, 32);

	let shard3Shape = new THREE.Shape();

	shard3Shape.moveTo(-0.26, -0.26);
	shard3Shape.lineTo(-0.26, 0.51);
	shard3Shape.lineTo(0.51, -0.26);
	
	let extrudeSettings = { depth: 0.1, bevelEnabled: false };

	let shard3Geometry = new THREE.ExtrudeGeometry( shard3Shape, extrudeSettings );

	
	let shard1 = new THREE.Mesh(shard1Geometry, shard1Material);
	let shard2 = new THREE.Mesh(shard2Geometry, shard2Material);
	let shard3 = new THREE.Mesh(shard3Geometry, shard3Material);

	shard1.position.x = 0.438;
	shard1.position.z = 0.08;

	shard2.position.x = -0.1;
	shard2.position.z = -0.46;

	shard3.position.x = -0.36;
	shard3.position.y = -0.05;
	shard3.position.z = 0.33;

	shard3.rotation.x = degToRad(-90);

	sigil.add(shard1);
	sigil.add(shard2);
	sigil.add(shard3);

	renderer = new THREE.WebGLRenderer({ 
		antialias: true,
		alpha: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);


	renderer.setAnimationLoop(animation);
	document.body.appendChild(renderer.domElement);



	rendererFav = new THREE.WebGLRenderer({ 
		antialias: true,
		preserveDrawingBuffer: true, // So toDataURL works
		alpha: true 
	});
	rendererFav.setSize(16, 16);
	// Hide favicon canvas
	rendererFav.domElement.style.visibility = "hidden";
	rendererFav.domElement.style.display = "none";
	rendererFav.domElement.style.position = "absolute";
	document.body.appendChild(rendererFav.domElement);

	window.addEventListener( 'resize', onWindowResize );
	window.addEventListener( 'blur', onBlur)
	window.addEventListener( 'focus', onFocus)

	let clicks = 0;
	let timeSinceLast = Date.now();
	renderer.domElement.addEventListener("click", ()=>{
		if(Date.now() - timeSinceLast > 350){ // Reset counter if last click time is greater than 0.35s
			clicks = 0;
		};

	renderer.domElement.filter = 'blur(10px)';
		clicks++
		timeSinceLast = Date.now(); // Set last click time
		if(clicks >= 3){ 
			clicks = 0;
			toggleDoFavicon();
		}
	})

}

function toggleDoFavicon() {
	doFavicon = !doFavicon;
	localStorage.setItem("doFavicon",doFavicon);
	if(!doFavicon){
		setFavicon("assets/images/logo.png");
	}
}

const timeOffset = Date.now();

let clock = new THREE.Clock();
let delta = 0;
let lowInterval = 1 / 24; // 24 fps

function animation(time) {
	delta += clock.getDelta();
	if (!render && delta < lowInterval) {
		return;
	}
	delta = delta % lowInterval;

	time = time + timeOffset;
	sigil.rotation.x = time / 2000 + degToRad(90);
	sigil.rotation.y = time / 1000;
	renderer.render(scene, camera);


	if(!render) return;
	if(doFavicon){
		rendererFav.render(scene, cameraFav);
		setFavicon(rendererFav.domElement.toDataURL());
	}
}

function setFavicon(url) {
	var favicon = document.getElementById("favicon");
	var newIcon = favicon.cloneNode(true);
	newIcon.setAttribute("href", url);
	favicon.parentNode.replaceChild(newIcon, favicon);
	//history.replaceState(null, null, window.location.hash == "#1" ? "#0" : "#1"); // chrome framerate?
}
//assets/images/logo.png

function onBlur(){
	render = false;
	setFavicon("assets/images/logo.png");
	renderer.domElement.style.filter  = 'blur(16px)';
	// Performance :)
	renderer.setSize(window.innerWidth/10, window.innerHeight/10);
	renderer.domElement.style.width = window.innerWidth+"px";
	renderer.domElement.style.height = window.innerHeight+"px";
}
function onFocus() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.domElement.style.filter = 'blur(0px)';
	render = true;
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	if(render){
		renderer.setSize(window.innerWidth, window.innerHeight);
	} else{
		renderer.setSize(window.innerWidth/10, window.innerHeight/10);
		renderer.domElement.style.width = window.innerWidth+"px";
		renderer.domElement.style.height = window.innerHeight+"px";
	}
}

