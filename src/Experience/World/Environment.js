import * as THREE from "three";
import { Color } from "three";
import Experience from "../Experience.js";

export default class Environment {
	constructor() {
		this.experience = new Experience();
		const { scene, resources, debug } = this.experience;
		this.scene = scene;
		this.resources = resources;
		this.debug = debug;

		// Debug
		if (this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder("Environment");
			this.debugFolder.close();
		}

		this.setSunLight();
		this.setEnvironmentMap();
		this.setEnvironmentModel();
		this.setLampLights();
		this.addParticles();
	}

	setSunLight() {
		this.ambient = new THREE.AmbientLight("#ffffff", 0.4);
		this.sunLight = new THREE.DirectionalLight("#ffffff", 0.8);
		this.sunLight.castShadow = true;
		this.sunLight.shadow.camera.near = 1;
		this.sunLight.shadow.camera.far = 40;
		this.sunLight.shadow.mapSize.set(4096, 4096);
		this.sunLight.shadow.camera.left = -50;
		this.sunLight.shadow.camera.right = 50;
		this.sunLight.shadow.camera.top = 50;
		this.sunLight.shadow.camera.bottom = -50;
		this.sunLight.shadow.normalBias = 0.001;
		this.sunLight.position.set(-3, 10, 7);
		this.scene.add(this.ambient);
		this.scene.add(this.sunLight);

		// Debug
		if (this.debug.active) {
			this.debugFolder
				.add(this.sunLight, "intensity")
				.name("SunLight Intensity")
				.min(0)
				.max(10)
				.step(0.001);

			this.debugFolder
				.add(this.sunLight.position, "x")
				.name("SunLight X")
				.min(-5)
				.max(5)
				.step(0.001);

			this.debugFolder
				.add(this.sunLight.position, "y")
				.name("SunLight Y")
				.min(-5)
				.max(5)
				.step(0.001);

			this.debugFolder
				.add(this.sunLight.position, "z")
				.name("SunLight Z")
				.min(-5)
				.max(5)
				.step(0.001);
		}
	}

	setEnvironmentMap() {
		this.environmentMap = {};
		this.environmentMap.intensity = 1;
		this.environmentMap.texture = this.resources.items.environmentMapTexture;
		this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;

		this.scene.environment = this.environmentMap.texture;
		this.scene.background = new Color(0xbbbbbb);

		this.environmentMap.updateMaterials = () => {
			this.scene.traverse((child) => {
				if (
					child instanceof THREE.Mesh &&
					child.material instanceof THREE.MeshStandardMaterial
				) {
					child.material.envMap = this.environmentMap.texture;
					child.material.envMapIntensity = this.environmentMap.intensity;
					child.material.needsUpdate = true;
				}
			});
		};
		this.environmentMap.updateMaterials();

		// Debug
		if (this.debug.active) {
			this.debugFolder
				.add(this.environmentMap, "intensity")
				.name("Env. Map Intensity")
				.min(0)
				.max(4)
				.step(0.001)
				.onChange(this.environmentMap.updateMaterials);
		}
	}

	setEnvironmentModel() {
		this.halloweenBitsTexture = this.resources.items.halloweenBitsTexture;
		this.halloweenBitsTexture.colorSpace = THREE.SRGBColorSpace;
		this.halloweenBitsTexture.flipY = false;
		this.graveyard = this.resources.items.graveyard;
		this.graveyard.scene.position.set(1, 0, -1);
		this.graveyard.scene.traverse((child) => {
			child.receiveShadow = true;
			child.castShadow = true;
			if (child instanceof THREE.Mesh) {
				child.material = new THREE.MeshPhongMaterial();
				child.material.map = this.halloweenBitsTexture;
			}
		});
		this.scene.add(this.graveyard.scene);
	}

	setLampLights() {
		this.lampSkullPost1 = this.resources.items.postSkull.scene.clone();
		this.lampSkullPost1.position.set(6, 0, -1);
		this.scene.add(this.lampSkullPost1);

		this.lampLight1 = new THREE.PointLight(0xff0f08, 20, 5, 0.75);
		this.lampLight1.castShadow = true;
		this.lampLight1.position.set(-2.5, 2.3, 12);
		this.lampSkullPost1.add(this.lampLight1);

		this.lampSkullPost2 = this.resources.items.postSkull.scene.clone();
		this.lampSkullPost2.position.set(1, 0, -1);
		this.scene.add(this.lampSkullPost2);

		this.lampLight2 = new THREE.PointLight(0xff0f08, 20, 5, 0.75);
		this.lampLight2.castShadow = true;
		this.lampLight2.position.set(-2.5, 2.3, 12);
		this.lampSkullPost2.add(this.lampLight2);

		if (this.debug.active) {
			this.debug.ui
				.add(this.lampLight1.position, "x")
				.min(-10)
				.max(10)
				.step(0.1);
			this.debug.ui
				.add(this.lampLight1.position, "y")
				.min(-10)
				.max(10)
				.step(0.1);
			this.debug.ui
				.add(this.lampLight1.position, "z")
				.min(-10)
				.max(10)
				.step(0.1);
			this.debug.ui
				.add(this.lampLight2.position, "x")
				.min(-10)
				.max(10)
				.step(0.1);
			this.debug.ui
				.add(this.lampLight2.position, "y")
				.min(-10)
				.max(10)
				.step(0.1);
			this.debug.ui
				.add(this.lampLight2.position, "z")
				.min(-10)
				.max(10)
				.step(0.1);
		}
	}

	addParticles() {
		const particlesGeometry = new THREE.BufferGeometry();
		const count = 250;

		const positions = new Float32Array(count * 3); // Multiply by 3 because each position is composed of 3 values (x, y, z)

		for (
			let i = 0;
			i < count * 3;
			i++ // Multiply by 3 for same reason
		) {
			positions[i] = (Math.random() - 0.5) * 30; // Math.random() - 0.5 to have a random value between -0.5 and +0.5
		}

		particlesGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3),
		);
		//Material
		const particlesMaterial = new THREE.PointsMaterial({
			size: 0.4,
			sizeAttenuation: true,
			color: 0xe05f0e,
			transparent: true,
			alphaTest: 0.5,
			alphaMap: this.resources.items.particle,
		});
		const particles = new THREE.Points(particlesGeometry, particlesMaterial);
		this.scene.add(particles);
	}
}
