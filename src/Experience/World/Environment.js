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
	}

	setSunLight() {
		this.ambient = new THREE.AmbientLight("#ffffff", 0.5);
		this.sunLight = new THREE.DirectionalLight("#ffffff", 2.5);
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
		this.scene.background = new Color(0xdfdfdf);

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
}
