import Experience from "../Experience";
import * as THREE from "three";
import { SCARE_CROW_INFO } from "./Constants";
export default class ScareCrow {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.scareCrowInfo = SCARE_CROW_INFO;
		this.setScarecrow();
	}

	getRandomValueFromArray(array) {
		// Generate a random index within the bounds of the array length
		const randomIndex = Math.floor(Math.random() * array.length);
		// Return the value at the random index
		return array[randomIndex];
	}

	setScarecrow() {
		this.model = this.resources.items.outsideScareCrow.scene.children[0];
		this.model.material = new THREE.MeshPhongMaterial();
		this.model.material.map = this.resources.items.halloweenBitsTexture;
		this.model.material.map.flipY = false;
		const { position, angle } = this.getRandomValueFromArray(
			this.scareCrowInfo,
		);
		this.model.position.set(position.x, position.y, position.z);
		this.model.rotation.y = angle;
		this.scene.add(this.model);
	}
}
