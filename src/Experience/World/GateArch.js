import Experience from "../Experience";
import * as THREE from "three";

export default class GateArch {
	constructor() {
		this.experience = new Experience();
		this.resources = this.experience.resources;

		this.scene = this.experience.scene;
		this.addGateArch();
	}

	addGateArch() {
		this.gateArch = this.resources.items.gateArch.scene;
		this.gateArch.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.material = new THREE.MeshPhongMaterial();
				child.material.transparent = true;
				child.material.map = this.resources.items.halloweenBitsTexture;
				child.material.map.colorspace = THREE.SRGBColorSpace;
				child.castShadow = true;
				child.material.metalness = 1;
				child.material.roughness = 0.8;
			}
		});
		this.gateArch.position.set(1, 0, -1);
		this.scene.add(this.gateArch);
	}

	showGateArch() {
		this.gateArch.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.material.opacity = 1;
			}
		});
	}

	hideGateArch() {
		this.gateArch.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.material.opacity = 0.2;
			}
		});
	}
}
