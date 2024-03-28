import * as THREE from "three";
import Experience from "../Experience";
import { graves } from "../sources";
import { POSITIVE_X_ARRAY, POSITIVE_Z_ARRAY } from "./Constants";

export default class Grave {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.addGraves();
	}

	getRandomGraveNumber(gravesArray) {
		const randomIndex = Math.floor(Math.random() * gravesArray.length);
		return randomIndex;
	}

	getRandomPosition(positions) {
		const positionXArray = POSITIVE_X_ARRAY;
		const positionZArray = POSITIVE_Z_ARRAY;

		let randomXValue, randomZValue;
		while (
			positions.some(
				(coord) =>
					(coord.x === positionXArray[randomXValue] &&
						coord.z === positionZArray[randomZValue]) ||
					(coord.x === 0 && coord.z === 0),
			)
		) {
			randomXValue = Math.floor(Math.random() * positionXArray.length);
			randomZValue = Math.floor(Math.random() * positionZArray.length);
		}

		return { x: positionXArray[randomXValue], z: positionZArray[randomZValue] };
	}

	addGraves() {
		const gravesCount = 10;
		const coordinates = [];
		for (let i = 0; i < gravesCount; i++) {
			const graveName = graves[this.getRandomGraveNumber(graves)].name;
			const grave = this.resources.items[graveName].scene.clone();
			grave.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.material.map = this.resources.items.graveBaseColor;
					child.castShadow = true;
				}
			});
			const randomPosition = this.getRandomPosition(coordinates);
			coordinates.push(randomPosition); // Mark the position as occupied
			grave.position.x = randomPosition.x;
			grave.position.z = randomPosition.z;
			this.scene.add(grave);
		}
	}
}
