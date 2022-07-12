// GLOBAL VAR SETUP
let NEON_RGB = 'rgb(255, 7, 58)';  //red - 255, 7, 58, green - 15, 255, 80
let NEON_INTENSITY = 0.5;
let NEON_UPPERLIMIT = 1.4;
let NEON_LOWERLIMIT = 0.6;
let NEON_RATEOFCHANGE = 0.004;

function init() {
	// INITIALZING SCENE AND CAMERA
	let scene = new THREE.Scene();
	scene.name = 'scene';
	// let datGUI = new dat.GUI();
	let clock = new THREE.Clock();
	// RectAreaLightUniformsLib.init();

	let camera = new THREE.PerspectiveCamera(
		40,
		window.innerWidth/window.innerHeight,
		1,
		200
	);
	camera.name = 'camera';
	camera.position.x = 3;
	camera.position.y = 9;
	camera.position.z = 14;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	
	// datGUI.add(camera.position, 'y', -99, 99);
	// datGUI.add(camera.position, 'x', -99, 99);
	// datGUI.add(camera.position, 'z', -99, 99);
	
	const canvas = document.querySelector('#webgl');
	const renderer = new THREE.WebGLRenderer({canvas});
	renderer.name = 'renderer';
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor('rgb(0, 0, 0)');
	renderer.shadowMap.enabled = true;
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.render(scene, camera);

	// OBJECT CREATION AND INSERTION
	let loader = new THREE.OBJLoader();
	let textureLoader = new THREE.TextureLoader();

	// Parent cylinder
	let cylinderMaterial = getMaterial('standard', 'rgb(255, 255, 255)');
	cylinderMaterial.map = textureLoader.load('https://kuijunming93.github.io/myWebpage/site/images/webGL/textures/concrete.jpg');
	cylinderMaterial.bumpMap = textureLoader.load('https://kuijunming93.github.io/myWebpage/site/images/webGL/textures/concrete.jpg');
	cylinderMaterial.roughnessMap = textureLoader.load('./static/assets/textures/scratch.jpg');
	cylinderMaterial.bumpScale = 0.02;
	cylinderMaterial.metalness = 0.8;
	cylinderMaterial.roughness = 1.3;
	let cylinderBase = getCylinder(cylinderMaterial, 5, 0.3, 40, 5);
	cylinderBase.castShadow = false;
	cylinderBase.receiveShadow = true;
	cylinderBase.name = 'baseCylinder';
	cylinderBase.position.z = 1.5;
	cylinderBase.position.x = 0.5;
	
	// Parent wall
	let wallMaterial = getMaterial('standard', 'rgb(125, 125, 125)');
	wallMaterial.map = textureLoader.load('./static/assets/textures/brick-texture-1.jpg');
	wallMaterial.bumpMap = textureLoader.load('https://kuijunming93.github.io/myWebpage/site/images/webGL/textures/concrete.jpg');
	wallMaterial.roughnessMap = textureLoader.load('https://kuijunming93.github.io/myWebpage/site/images/webGL/textures/concrete.jpg');
	wallMaterial.bumpScale = 0.1;
	wallMaterial.metalness = 0.01;
	wallMaterial.roughness = 2;

	let wall = getBox(wallMaterial, 30, 12, 0.7);
	wall.name = 'wall';
	wall.position.z = -6;
	wall.position.x = 0.25;
	wall.position.y = 5;
	wall.castShadow = true;
	wall.receiveShadow = true;
	
	// Object loaders
	loader.load('./static/assets/burger-model/Scaniverse.obj', function (object) {
		let colorMap = textureLoader.load('./static/assets/burger-model/Scaniverse.jpg');
		let modelMaterial = getMaterial('standard', 'rgb(255, 255, 255)');
		object.traverse(function(child) {
			child.material = modelMaterial;
			modelMaterial.map = colorMap;
			modelMaterial.roughness = 2;
			modelMaterial.bumpScale = 0.175;
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});
		
		object.position.y = -0.25;
		object.position.z = 0.9;
		object.scale.x = 20;
		object.scale.y = 20;
		object.scale.z = 20;
		cylinderBase.add(object);
	});

	loader.load('./static/assets/drink-model/tinker.obj', function (object) {
		let modelMaterial = getMaterial('standard', 'rgb(211, 211, 211)');
		object.traverse(function(child) {
			child.material = modelMaterial;
			modelMaterial.roughness = 0.875;
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});

		object.position.y = -0.3;
		object.position.x = -2;
		object.position.z = -2;
		object.rotation.x = Math.PI + Math.PI/2;
		object.scale.x = 0.1;
		object.scale.y = 0.1;
		object.scale.z = 0.1;
		cylinderBase.add(object);
	});

	// NEON LIGHT OBJECT
	loader.load('./static/assets/open-sign-model/Open Sign.obj', function (object) {
		let modelMaterial = getMaterial('standard', NEON_RGB);
		let objectLightSource = getPointLight(NEON_INTENSITY, NEON_RGB);
		objectLightSource.decay = 2;
		objectLightSource.power = 0.3;
		objectLightSource.name = 'neon-light';
		object.traverse(function(child) {
			child.material = modelMaterial;
			if ( child.isMesh ) {
				child.castShadow = true;
			}
		});

		object.position.y = -3.5;
		object.position.x = 0;
		object.position.z = -1;
		object.rotation.y = Math.PI;
		object.scale.x = 0.008;
		object.scale.y = 0.008;
		object.scale.z = 0.008;
		object.add(objectLightSource);
		wall.add(object);
	});

	// PLANT OBJECT
	loader.load('./static/assets/pot-plant-model/Aloe_plant_SF.obj', function (object) {
		let colorMap = textureLoader.load('./static/assets/pot-plant-model/Aloe_plant.jpg');
		let modelMaterial = getMaterial('standard', 'rgb(211, 211, 211)');
		object.traverse(function(child) {
			child.material = modelMaterial;
			modelMaterial.map = colorMap;
			modelMaterial.bumpMap = textureLoader.load('./static/assets/pot-plant-model/Aloe_plant_occlusion.jpg');
			modelMaterial.roughnessMap = textureLoader.load('./static/assets/pot-plant-model/Aloe_plant_normal.jpg');
			modelMaterial.roughness = 1.6;
			modelMaterial.bumpScale = 0.08;
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});

		object.position.y = -0.3;
		object.position.x = -6;
		object.position.z = -3;
		object.rotation.x = 0;
		object.scale.x = 0.7;
		object.scale.y = 0.7;
		object.scale.z = 0.7;
		scene.add(object);
	});

	// Environment cube maps
	// var path = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/cube/SwedishRoyalCastle/';
	// let reflectionCube = new THREE.CubeTextureLoader().load(urls);
	// reflectionCube.format = THREE.RGBFormat;
	// scene.background = reflectionCube;

	// Plane object
	let planeMaterial = getMaterial('standard', 'rgb(255, 255, 255)');
	planeMaterial.map = textureLoader.load('./static/assets/textures/wood-texture-1.jpg');
	// planeMaterial.bumpMap = textureLoader.load('https://kuijunming93.github.io/myWebpage/site/images/webGL/textures/concrete.jpg');
	// planeMaterial.roughnessMap = textureLoader.load('https://kuijunming93.github.io/myWebpage/site/images/webGL/textures/concrete.jpg');
	// planeMaterial.bumpScale = 0.03;
	planeMaterial.metalness = 0.05;
	planeMaterial.roughness = 0.7;
	// planeMaterial.envMap = reflectionCube;
	
	let plane = getPlane(planeMaterial, 80);
	plane.rotation.x = Math.PI/2;
	plane.castShadow = false;
	plane.receiveShadow = true;
	

	// WRAPPING ITERATION
	var maps = ['map']
	// , 'bumpMap', 'roughnessMap'];
	let wrapMaterialList = [planeMaterial];
	for (let i=0;i<wrapMaterialList.length;i++){
		maps.forEach(function(mapName) {
			let texture = wrapMaterialList[i][mapName];
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set(3, 3);
		});
	}

	scene.add(plane, cylinderBase, wall);

	// LIGHT SOURCE CREATION
	// const ambientLight = new THREE.AmbientLight( 0x404040 );
	let light = getPointLight(1.1, null);
	light.castShadow = true;
	light.shadow.mapSize.width = 1024; // default
	light.shadow.mapSize.height = 1024; // default
	light.decay = 2;
	light.position.x = 4;
	light.position.y = 5;
	light.position.z = 8;
	
	// datGUI.add(light, 'intensity', 0, 10);
	// datGUI.add(light.position, 'y', 0, 15);
	// datGUI.add(light.position, 'x', -10, 10);
	// datGUI.add(light.position, 'z', -10, 10);

	// SECONDARY OBJECT NEON LIGHT SOURCE	
	let objectLightSourceWall = getPointLight(NEON_INTENSITY, NEON_RGB);
	objectLightSourceWall.decay = 2;
	objectLightSourceWall.power = 0.3;
	objectLightSourceWall.name = 'neon-light-onWall';
	
	scene.add(light, objectLightSourceWall);
	// CAMERA ANGLES

	// INTIALIZE RENDERING
	let controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.minDistance = 5; controls.maxDistance = 22.5;
	controls.maxPolarAngle = Math.PI/2.1;
	controls.maxAzimuthAngle = Math.PI/3;
	controls.minAzimuthAngle = -Math.PI/3;
	update(renderer, scene, camera, controls, clock);
}

function getSphere(size, type) {
	let geometry = new THREE.SphereGeometry(size, 24, 24);
	switch (type){
		case 'basic':
			var material = new THREE.MeshBasicMaterial({
				color: 'rgb(255, 255, 255)'
			});
		default:
			var material = new THREE.MeshStandardMaterial({
				color: 'rgb(255, 255, 255)'
			});

	}
	
	var mesh = new THREE.Mesh(
		geometry,
		material 
	);

	return mesh;
}

function getPlane(material, size) {
	var geometry = new THREE.PlaneGeometry(size, size);
	material.side = THREE.DoubleSide;
	var obj = new THREE.Mesh(geometry, material);
	obj.receiveShadow = true;

	return obj;
}

function getCylinder(material, radius, height, radiusSegment, heightSegment){
	let geometry = new THREE.CylinderGeometry(radius, radius, height, radiusSegment, heightSegment);
	let cylinder = new THREE.Mesh( geometry, material);
	return cylinder;
}

function getBox(material, w, h, d){
	let geometry = new THREE.BoxGeometry(w,h,d);
	let box = new THREE.Mesh(geometry, material);
	return box;
}

function getPointLight(intensity, color) {
	if (color === null) color = 0xffffff;
	var light = new THREE.PointLight(color, intensity);
	return light;
}

function getMaterial(type, color) {
	var selectedMaterial;
	var materialOptions = {
		color: color === undefined ? 'rgb(255, 255, 255)' : color,
	};

	switch (type) {
		case 'basic':
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
		case 'lambert':
			selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
			break;
		case 'phong':
			selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
			break;
		case 'standard':
			selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
			break;
		default: 
			selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
			break;
	}

	return selectedMaterial;
}

function resizeRendererToDisplaySize(renderer) {
	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
		renderer.setSize(width, height, false);
	}
	return needResize;
}

function update(renderer, scene, camera, controls, clock) {
	renderer.render(
		scene,
		camera
	);
	let timeElapsed = clock.getElapsedTime();
	let baseCylinder = scene.getObjectByName('baseCylinder');
	baseCylinder.rotation.y = timeElapsed * 1.5 * 0.1;

	// GENERAL NEON LIGHT
	let neonLight = (scene.getObjectByName('wall')).getObjectByName('neon-light');
	if (neonLight){
		neonLight.intensity += NEON_RATEOFCHANGE;
		if (neonLight.intensity >= NEON_UPPERLIMIT){
			neonLight.name = 'neon-light-decrease';
		}
	} else {
		neonLight = (scene.getObjectByName('wall')).getObjectByName('neon-light-decrease');
		if (neonLight){
			neonLight.intensity -= NEON_RATEOFCHANGE;
			if (neonLight.intensity <= NEON_LOWERLIMIT){
				neonLight.name = 'neon-light';
			}
		}
	}
	// NEON LIGHT ON WALL
	neonLight = scene.getObjectByName('neon-light-onWall');
	if (neonLight){
		neonLight.intensity += NEON_RATEOFCHANGE;
		if (neonLight.intensity >= NEON_UPPERLIMIT){
			neonLight.name = 'neon-light-onWall-decrease';
		}
	} else {
		neonLight = scene.getObjectByName('neon-light-onWall-decrease');
		if (neonLight){
			neonLight.intensity -= NEON_RATEOFCHANGE;
			if (neonLight.intensity <= NEON_LOWERLIMIT){
				neonLight.name = 'neon-light-onWall';
			}
		}
	}

	// GENERAL
	if (resizeRendererToDisplaySize(renderer)) {
		const canvas = renderer.domElement;
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
	}

	controls.update();

	requestAnimationFrame(function() {
		update(renderer, scene, camera, controls, clock);
	})
}

init();