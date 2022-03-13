let camera, scene, renderer;
let sigil;

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

	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 10);
	camera.position.z = 3;

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x404040);
	
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

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animation);
	document.body.appendChild(renderer.domElement);

	window.addEventListener( 'resize', onWindowResize );
}

const timeOffset = Date.now();
function animation(time) {
    time = time + timeOffset;
	sigil.rotation.x = time / 2000 + degToRad(90);
	sigil.rotation.y = time / 1000;
	renderer.render(scene, camera);
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}