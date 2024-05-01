import Experience from "../Experience";
import * as THREE from "three";
import { POSITIVE_X_ARRAY, POSITIVE_Z_ARRAY } from "./Constants";
import { getRandomPosition } from "../Utils/getRandomPosition";
export default class Candies {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.gravesPositions = this.experience.world.graves.gravesCoordinates;
		this.getCandy();
	}

	getCandy() {
		const candy = this.resources.items.smallCandy.scene.clone().children[0];
		candy.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.material = new THREE.MeshPhongMaterial();
				child.material.map = this.resources.items.halloweenBitsTexture;
			}
		});
		this.addCandy(candy);
	}

	addCandy(candy) {
		const { x, z } = getRandomPosition(this.gravesPositions);
		candy.position.set(x, 0.6, z);
		this.scene.add(candy);
		this.startCandyAnimation();
	}

	startCandyAnimation() {}
}
