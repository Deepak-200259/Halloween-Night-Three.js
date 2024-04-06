import * as THREE from "three";
import Experience from "./Experience.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Vector3 } from "three";

export default class Camera {
	constructor() {
		this.experience = new Experience();
		this.sizes = this.experience.sizes;
		this.scene = this.experience.scene;
		this.canvas = this.experience.canvas;
		this.debug = this.experience.debug;

		if (this.debug.active) {
			this.orbitControlsSettings = this.debug.ui.addFolder(
				"Orbit Control Settings",
			);
			this.orbitControlsSettings.close();
		}
		this.setInstance();
		this.setControls();
	}

	setInstance() {
		this.instance = new THREE.PerspectiveCamera(
			40,
			this.sizes.width / this.sizes.height,
			0.1,
			100,
		);
		this.instance.position.set(20, 0, 20);
		this.scene.add(this.instance);
	}

	setControls() {
		this.controls = new OrbitControls(this.instance, this.canvas);
		this.controls.enableDamping = false;
		this.controls.dampingFactor = 0.6;
		this.controls.target = new Vector3(1, 0, -1);
		this.controls.enablePan = false;
		this.controls.enableZoom = true;
		this.controls.minDistance = 10;
		this.controls.maxDistance = 34;
		this.controls.minPolarAngle = (Math.PI / 180) * 55;
		this.controls.maxPolarAngle = (Math.PI / 180) * -55;
		this.controls.minAzimuthAngle = -(Math.PI / 180) * 45;
		this.controls.maxAzimuthAngle = (Math.PI / 180) * 45;

		if (this.debug.active) this.debugOrbitControlSettings();
	}

	debugOrbitControlSettings() {
		this.orbitControlsSettings
			.add(this.controls, "enableZoom")
			.onChange((value) => {
				this.controls.enableZoom = value;
			})
			.name("Enable Zoom");
		this.orbitControlsSettings
			.add(this.controls, "enableDamping")
			.onChange((value) => {
				this.controls.enableDamping = value;
			})
			.name("Enable Damping");
		this.orbitControlsSettings
			.add(this.controls, "enablePan")
			.onChange((value) => {
				this.controls.enablePan = value;
			})
			.name("Enable Pan");
		this.orbitControlsSettings
			.add(this.controls, "dampingFactor")
			.min(0)
			.max(2)
			.step(0.1)
			.onChange((value) => {
				this.controls.dampingFactor = value;
			})
			.name("Damping Factor");
		this.orbitControlsSettings.add(this.controls.target, "x").name("Target X");
		this.orbitControlsSettings.add(this.controls.target, "y").name("Target Y");
		this.orbitControlsSettings.add(this.controls.target, "z").name("Target Z");
		this.orbitControlsSettings
			.add(this.controls, "minDistance")
			.min(0)
			.step(1)
			.onFinishChange((value) => {
				this.controls.minDistance = value;
			})
			.name("Minm. Distance");
		this.orbitControlsSettings
			.add(this.controls, "maxDistance")
			.max(75)
			.step(1)
			.onFinishChange((value) => {
				this.controls.maxDistance = value;
			})
			.name("Maxm. Distance");
		this.orbitControlsSettings
			.add(this.controls, "minPolarAngle")
			.onFinishChange((value) => {
				this.controls.minPolarAngle = value;
			})
			.name("Minm.Polar Angle");
		this.orbitControlsSettings
			.add(this.controls, "maxPolarAngle")
			.onFinishChange((value) => {
				this.controls.maxPolarAngle = value;
			})
			.name("Maxm. Polar Angle");
		this.orbitControlsSettings
			.add(this.controls, "minAzimuthAngle")
			.onFinishChange((value) => {
				this.controls.minAzimuthAngle = value;
			})
			.name("Minm. Azimuth Angle");
		this.orbitControlsSettings
			.add(this.controls, "maxAzimuthAngle")
			.onFinishChange((value) => {
				this.controls.maxAzimuthAngle = value;
			})
			.name("Maxm. Azimuth Angle");
	}

	resize() {
		this.instance.aspect = this.sizes.width / this.sizes.height;
		this.instance.updateProjectionMatrix();
	}

	update() {
		this.controls.update();
	}
}
