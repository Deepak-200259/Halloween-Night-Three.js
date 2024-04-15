import * as THREE from "three";
import Experience from "../Experience";
import { graves } from "../sources";
import gsap from "gsap";
import { POSITIVE_X_ARRAY, POSITIVE_Z_ARRAY } from "./Constants";

export default class Grave {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.gravesCoordinates = this.addGraves();
	}

	getRandomGraveNumber(gravesArray) {
		const randomIndex = Math.floor(Math.random() * gravesArray.length);
		return randomIndex;
	}

	getRandomPosition(positions) {
		const positionXArray = POSITIVE_X_ARRAY;
		const positionZArray = POSITIVE_Z_ARRAY;

		let randomXValue, randomZValue;
		do {
			randomXValue = Math.floor(Math.random() * positionXArray.length);
			randomZValue = Math.floor(Math.random() * positionZArray.length);
		} while (
			positions.some(
				(coord) =>
					coord.x === positionXArray[randomXValue] &&
					coord.z === positionZArray[randomZValue],
			) ||
			(randomXValue === 0 && randomZValue === 0)
		);

		return { x: positionXArray[randomXValue], z: positionZArray[randomZValue] };
	}

	addGraves() {
		const gravesCount = 10;
		const coordinates = [{ x: 0, z: 0 }];
		for (let i = 0; i < gravesCount; i++) {
			const graveName = graves[this.getRandomGraveNumber(graves)].name;
			const grave = this.resources.items[graveName].scene.clone();
			grave.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.material = new THREE.MeshPhongMaterial();
					child.material.map = this.resources.items.halloweenBitsTexture;
					child.castShadow = true;
					child.material.metalness = 1;
					child.material.roughness = 0.8;
				}
			});
			const randomPosition = this.getRandomPosition(coordinates);
			coordinates.push(randomPosition); // Mark the position as occupied
			grave.position.x = randomPosition.x;
			grave.position.y = 7;
			grave.position.z = randomPosition.z;
			grave.visible = false;
			setTimeout(() => {
				grave.visible = true;
				this.graveAddingAnimation(grave);
			}, i * 200);
			this.scene.add(grave);
		}
		return coordinates;
	}

	graveAddingAnimation(grave) {
		gsap
			.to(grave.position, { y: 0, duration: 0.5, ease: "power2.in" })
			.then(() => {
				gsap.to(grave.scale, { x: 1.2, y: 0.8, duration: 0.15 }).then(() => {
					gsap.to(grave.scale, { x: 1, y: 1, duration: 0.15 });
				});
				if (this.experience.soundEnabled) {
					this.experience.audioManager.playAudio(
						this.resources.items.obstacleFallSound,
					);
				}
			});
	}
}
