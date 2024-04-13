import * as THREE from "three";
import gsap from "gsap";
import Experience from "../Experience";
import { POSITIVE_X_ARRAY, POSITIVE_Z_ARRAY, POWERUPS } from "./Constants";

export default class PowerUps {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;

		const powerupSpawnInterval = setInterval(() => {
			if (!this.experience.gameEnded) {
				const selectedPowerup = this.choosePowerUp();
				this.currentPowerup = this.addSelectedPowerup(selectedPowerup);
				this.startPowerupAnimation();
			} else {
				clearInterval(powerupSpawnInterval);
			}
			const powerUpRemovalInterval = setTimeout(() => {
				if (!this.experience.gameEnded) {
					this.removeCurrentPowerupAnimation();
				} else {
					clearInterval(powerUpRemovalInterval);
				}
			}, 1500);
		}, 2500);
	}

	choosePowerUp() {
		const powerUps = Object.values(POWERUPS);
		const value = Math.floor(Math.random() * powerUps.length);
		return powerUps[value];
	}

	addSelectedPowerup(powerup) {
		let currentPowerUp = null;
		switch (powerup) {
			case POWERUPS.INVINCIBLE:
				currentPowerUp = this.resources.items.bluePowerUp.scene.clone();
				currentPowerUp.traverse((child) => {
					if (child instanceof THREE.Mesh) {
						child.material = new THREE.MeshPhongMaterial();
						child.material.transparent = true;
						child.material.opacity = 0;
						child.material.map = this.resources.items.halloweenBitsTexture;
						child.castShadow = true;
					}
				});
				this.scene.add(currentPowerUp);
				break;
			case POWERUPS.SLOW_DOWN:
				currentPowerUp = this.resources.items.greenPowerUp.scene.clone();
				currentPowerUp.traverse((child) => {
					if (child instanceof THREE.Mesh) {
						child.material = new THREE.MeshPhongMaterial();
						child.material.transparent = true;
						child.material.opacity = 0;
						child.material.map = this.resources.items.halloweenBitsTexture;
						child.castShadow = true;
					}
				});
				this.scene.add(currentPowerUp);
				break;
			case POWERUPS.SPEED_UP:
				currentPowerUp = this.resources.items.yellowPowerUp.scene.clone();
				currentPowerUp.traverse((child) => {
					if (child instanceof THREE.Mesh) {
						child.material = new THREE.MeshPhongMaterial();
						child.material.transparent = true;
						child.material.opacity = 0;
						child.material.map = this.resources.items.halloweenBitsTexture;
						child.castShadow = true;
					}
				});
				this.scene.add(currentPowerUp);
				break;
		}
		currentPowerUp.rotation.z = (Math.PI / 180) * 35;
		const positions = this.experience.world.graves.gravesCoordinates;
		const { x, z } = this.getRandomPosition(positions);
		currentPowerUp.position.set(x, 2, z);
		return currentPowerUp;
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

	startPowerupAnimation() {
		gsap.to(this.currentPowerup.position, {
			y: 0.6,
			duration: 0.5,
		});
		gsap.to(this.currentPowerup.children[0].material, {
			opacity: 1,
			duration: 0.5,
		});
		gsap
			.to(this.currentPowerup.rotation, {
				y: Math.PI * 2,
				duration: 1,
				ease: "none",
			})
			.repeat(Infinity);
	}

	removeCurrentPowerupAnimation() {
		gsap.to(this.currentPowerup.position, {
			y: 2,
			duration: 0.5,
		});
		gsap
			.to(this.currentPowerup.children[0].material, {
				opacity: 0,
				duration: 0.5,
			})
			.then(() => {
				this.removePowerup(this.currentPowerup);
			});
	}

	removePowerup(mesh) {
		if (mesh !== null) {
			for (let i = 0; i < mesh.children.length; i++) {
				this.removePowerup(mesh.children[i]);
			}
			if (mesh.geometry) {
				mesh.geometry.dispose();
			}
			if (mesh.material) {
				// If the material is an array, dispose each material
				if (Array.isArray(mesh.material)) {
					mesh.material.forEach((material) => material.dispose());
				} else {
					mesh.material.dispose();
				}
			}
			if (mesh.texture) {
				mesh.texture.dispose();
			}
			this.scene.remove(this.currentPowerup);
			this.currentPowerup = null;
		}
	}
}
