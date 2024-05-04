import Experience from "../Experience";
import * as THREE from "three";
import { POSITIVE_X_ARRAY, POSITIVE_Z_ARRAY } from "./Constants";
import { getRandomPosition } from "../Utils/getRandomPosition";
import gsap from "gsap";
export default class Candies {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;
		this.gravesPositions = this.experience.world.graves.gravesCoordinates;
		this.candiesCurrentlyInScene = [];
		this.boundingBoxesOfCandies = [];
		this.getCandy();
	}

	getCandy() {
		const candy = this.resources.items.smallCandy.scene.clone().children[0];
		const addCandyInterval = setInterval(() => {
			if (!this.experience.gameEnded) {
				this.addCandy(candy.clone());
			} else {
				clearInterval(addCandyInterval);
			}
		}, 5000);
		setTimeout(() => {
			const removecandyInterval = setInterval(() => {
				if (this.experience.gameEnded) {
					clearInterval(removecandyInterval);
				}
				if (!this.experience.gameEnded) {
					const candyToBeRemoved = this.candiesCurrentlyInScene.shift();
					this.boundingBoxesOfCandies.shift();
					if (this.candiesCurrentlyInScene[0] !== null) {
						this.disposeObject(candyToBeRemoved);
					}
				}
			}, 7500);
		}, 5000);
	}

	disposeObject(obj) {
		if (obj !== null) {
			for (let i = 0; i < obj.children.length; i++) {
				this.disposeObject(obj.children[i]);
			}
			if (obj.geometry) {
				obj.geometry.dispose();
			}
			if (obj.material) {
				// If the material is an array, dispose each material
				if (Array.isArray(obj.material)) {
					obj.material.forEach((material) => material.dispose());
				} else {
					obj.material.dispose();
				}
			}
			if (obj.texture) {
				obj.texture.dispose();
			}
			obj.removeFromParent();
			
		}
	}

	addCandy(candy) {
		candy.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				const candiesBoundingBox = new THREE.Box3().setFromObject(child, true);
				this.boundingBoxesOfCandies.push(candiesBoundingBox);
				child.castShadow = true;
				child.material = new THREE.MeshPhongMaterial();
				child.material.map = this.resources.items.halloweenBitsTexture;
			}
		});
		const { x, z } = getRandomPosition(this.gravesPositions);
		candy.position.set(x, 0.6, z);
		this.scene.add(candy);
		this.candiesCurrentlyInScene.push(candy);
		this.startCandyAnimation(candy);
	}

	startCandyAnimation(candy) {
		gsap
			.to(candy.rotation, {
				y: Math.PI * 2,
				duration: 1,
				ease: "none",
			})
			.repeat(Infinity);
	}

	updateBoundingBox(object, box, type) {
		box.setFromObject(object);
		return box;
	}

	update() {
		if (!this.experience.gameEnded) {
			const playerBoundingBox = this.updateBoundingBox(
				this.experience.world.player.player.children[0],
				this.experience.world.player.playerBoundingBox,
			);
			for (let i = 0; i < this.candiesCurrentlyInScene.length; i++) {
				const candy = this.candiesCurrentlyInScene[i];
				if (candy && this.boundingBoxesOfCandies[i]) {
					const candyBoundingBox = this.updateBoundingBox(
						candy,
						this.boundingBoxesOfCandies[i],
					);
					if (candyBoundingBox.intersectsBox(playerBoundingBox)) {
						this.experience.score += 50;
						this.candiesCurrentlyInScene[i] = null;
						this.boundingBoxesOfCandies[i] = null;
						this.disposeObject(candy);
					}
				}
			}
		}
	}
}
