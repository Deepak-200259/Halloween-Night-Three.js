import * as THREE from "three";
import Experience from "../Experience.js";

export default class Ground {
	constructor() {
		this.experience = new Experience();
		const { scene, resources } = this.experience;
		this.scene = scene;
		this.resources = resources;

		this.setGround();
	}

	getTexture() {
		const halloweenBitsTexture = this.resources.items.halloweenBitsTexture;
		halloweenBitsTexture.colorSpace = THREE.SRGBColorSpace;
		halloweenBitsTexture.flipY = false;
		return halloweenBitsTexture;
	}

	setGround() {
		this.ground = this.resources.items.ground;
		this.ground.scene.position.set(1, 0, -1);
		this.ground.scene.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.material = new THREE.MeshPhongMaterial();
				child.material.map = this.getTexture();
				child.receiveShadow = true;
			}
		});
		this.scene.add(this.ground.scene);
	}
}
