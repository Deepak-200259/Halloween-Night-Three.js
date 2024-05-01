import gsap from "gsap";
import Experience from "../Experience";
import {
	GHOST_TYPE,
	NEGATIVE_X_ARRAY,
	NEGATIVE_Z_ARRAY,
	POSITIVE_X_ARRAY,
	POSITIVE_Z_ARRAY,
} from "./Constants";
import * as THREE from "three";
export default class Ghost {
	constructor(ghostType) {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.camera = this.experience.camera;

		this.resources = this.experience.resources;
		this.ghostsCurrentlyInScene = [];
		this.boundingBoxesOfGhosts = [];
		this.ghostType = ghostType;
		this.spawnGhosts();
	}

	spawnGhosts() {
		const ghostSpawnInterval = setInterval(() => {
			if (!this.experience.gameEnded) {
				const { selectedghost, ghostPos } = this.selectGhost(this.ghostType);
				this.setupGhost(selectedghost, ghostPos, ghostPos.directionToMoveArray);
			} else {
				clearInterval(ghostSpawnInterval);
			}
		}, 4500);
	}

	selectGhost(ghostType) {
		let selectedghost = null,
			ghostPos = null;
		switch (ghostType) {
			case GHOST_TYPE.WHITE_GHOST: {
				selectedghost = this.resources.items.ghost.scene.clone();
				selectedghost.userData.id = GHOST_TYPE.WHITE_GHOST;
				ghostPos = this.selectGhostPosition();
				break;
			}
			case GHOST_TYPE.FAT_PUMPKIN_GHOST: {
				selectedghost = this.resources.items.evilPumpkin.scene.clone();
				selectedghost.userData.id = GHOST_TYPE.FAT_PUMPKIN_GHOST;
				ghostPos = this.selectghostPosition();
				break;
			}
		}
		return { selectedghost, ghostPos };
	}

	selectGhostPosition() {
		const positionXArray = POSITIVE_X_ARRAY;
		const positionZArray = POSITIVE_Z_ARRAY;

		const selectedArray = Math.random() < 0.5 ? positionXArray : positionZArray;

		const value1 =
			Math.random() < 0.5
				? selectedArray[0]
				: selectedArray[selectedArray.length - 1];

		const otherArray =
			selectedArray === positionXArray ? positionZArray : positionXArray;

		const value2 = otherArray[Math.floor(Math.random() * otherArray.length)];

		return selectedArray === positionXArray
			? { x: value1, z: value2, directionToMoveArray: selectedArray }
			: { x: value2, z: value1, directionToMoveArray: selectedArray };
	}

	setupGhost(ghost, positionOfGhost, directionToMoveArray) {
		ghost.children[0].material.opacity = 0;
		ghost.position.set(positionOfGhost.x, 0.6, positionOfGhost.z);
		console.log(ghost.position);
		ghost.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				const ghostBoundingBox = new THREE.Box3().setFromObject(child, true);
				this.boundingBoxesOfGhosts.push(ghostBoundingBox);
				child.material = new THREE.MeshPhongMaterial();
				child.material.map = this.experience.resources.items.ghostBaseColor;
				child.material.map.flipY = false;
				child.material.transparent = true;
				child.material.map.colorspace = THREE.SRGBColorSpace;
				child.castShadow = true;
			}
		});
		gsap.to(ghost.children[0].material, { opacity: 1 });
		this.scene.add(ghost);
		this.ghostsCurrentlyInScene.push(ghost);
		const movementObj = this.CheckDirectionToMoveGhost(positionOfGhost);
		ghost.rotation.y = this.chooseRotationAngle(ghost.position, movementObj);
		this.playGhostAnim(ghost, movementObj);
	}

	chooseRotationAngle(ghostPosition, movementObj) {
		if (movementObj.z && ghostPosition.x === -6) return Math.PI / 2;
		else if (movementObj.z && ghostPosition.x === 8) return -Math.PI / 2;
		else if (movementObj.x && ghostPosition.z === -8) return 0;
		else if (movementObj.x && ghostPosition.z === 6) return Math.PI;
		else if (ghostPosition.x === -6) return Math.PI / 2;
		else if (ghostPosition.x === 8) return -Math.PI / 2;
		else if (ghostPosition.z === -8) return 0;
		else if (ghostPosition.z === 6) return Math.PI;
	}

	playGhostAnim(ghost, movementObj) {
		const ghostAnimTimeline = gsap.timeline();
		gsap
			.fromTo(
				ghost.position,
				{ y: 3 },
				{ y: 0.6, duration: 1 * this.experience.ghostsSpeed },
			)
			.then(() => {
				ghostAnimTimeline
					.to(ghost.position, {
						x:
							movementObj.x !== undefined
								? ghost.position.x
								: movementObj.directionArray[
										movementObj.directionArray.length - 1
								  ],
						z:
							movementObj.z !== undefined
								? ghost.position.z
								: movementObj.directionArray[
										movementObj.directionArray.length - 1
								  ],
						duration: 1 * this.experience.ghostsSpeed,
						ease: "none",
					})
					.to(ghost.rotation, {
						y: ghost.rotation.y + Math.PI,
						duration: 0.1 * this.experience.ghostsSpeed,
						ease: "none",
					})
					.to(ghost.position, {
						x:
							movementObj.x !== undefined
								? ghost.position.x
								: movementObj.directionArray[0],
						z:
							movementObj.z !== undefined
								? ghost.position.z
								: movementObj.directionArray[0],
						duration: 1 * this.experience.ghostsSpeed,
						ease: "none",
					})
					.to(ghost.rotation, {
						y: ghost.rotation.y + Math.PI,
						duration: 0.1 * this.experience.ghostsSpeed,
						ease: "none",
					})
					.repeat(1)
					.then(() => {
						gsap.fromTo(
							ghost.position,
							{ y: 0.6 },
							{ y: 3, duration: 1 * this.experience.ghostsSpeed },
						);
						gsap
							.to(ghost.children[0].material, { opacity: 0, duration: 0.5 })
							.then(() => this.removeGhostFromScene(ghost));
					});
			});
	}

	CheckDirectionToMoveGhost(startPositionOfGhost) {
		const { x, z } = startPositionOfGhost;

		const positiveXArray = POSITIVE_X_ARRAY,
			positiveZArray = POSITIVE_Z_ARRAY,
			negativeXArray = NEGATIVE_X_ARRAY,
			negativeZArray = NEGATIVE_Z_ARRAY;

		const chooseRandomValue = (x, z) => {
			let array1, array2;
			if (x < 0) array1 = positiveXArray;
			else array1 = negativeXArray;
			if (z < 0) array2 = positiveZArray;
			else array2 = negativeZArray;

			return Math.random() < 0.5
				? { z: z, directionArray: array1 }
				: { x: x, directionArray: array2 };
		};

		if (
			(x === -6 && z === -8) ||
			(x === -6 && z === 6) ||
			(x === 8 && z === 6) ||
			(x === 8 && z === -8)
		) {
			let obj = chooseRandomValue(x, z);
			return obj;
		}

		if (x === -6) return { z: z, directionArray: positiveXArray };
		else if (x === 8) return { z: z, directionArray: negativeXArray };
		if (z === -8) return { x: x, directionArray: positiveZArray };
		else if (z === 6) return { x: x, directionArray: negativeZArray };
	}

	removeGhostFromScene(ghost) {
		if (ghost.parent) {
			this.disposeObject(ghost);
			ghost.removeFromParent();
		}
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
			if (
				this.ghostsCurrentlyInScene[0] !== null ||
				this.ghostsCurrentlyInScene[0] !== undefined
			) {
				this.ghostsCurrentlyInScene.shift();
			}
		}
	}

	updateBoundingBox(object, box, type) {
		box.setFromObject(object);
		// console.log(type, box);
		return box;
	}

	update() {
		if (!this.experience.gameEnded) {
			// Calculate round number based on score
			const round = Math.floor(this.experience.score / 1000) + 1;

			// Update round only if it has changed
			if (round > this.experience.round) {
				this.experience.round = round;
				this.experience.hud.updateRounds();
			}
			if (this.experience.lives > 0) {
				if (this.experience.isInvincible === false) {
					const playerBox = this.updateBoundingBox(
						this.experience.world.player.player.children[0],
						this.experience.world.player.playerBoundingBox,
						"player",
					);
					for (let i = 0; i < this.ghostsCurrentlyInScene.length; i++) {
						if (this.ghostsCurrentlyInScene[i]) {
							const ghostBox = this.updateBoundingBox(
								this.ghostsCurrentlyInScene[i].children[0],
								this.boundingBoxesOfGhosts[i],
								"ghost",
							);

							if (ghostBox.intersectsBox(playerBox)) {
								if (this.experience.soundEnabled) {
									this.experience.audioManager.playAudio(
										this.resources.items.smashSound,
									);
								}
								this.experience.isInvincible = true;
								this.experience.lives -= 1;
								this.experience.powerupActive = false;
								this.experience.world.powerUps.speedUpTimeout &&
									clearTimeout(this.experience.world.powerUps.speedUpTimeout);
								this.experience.world.powerUps.slowDownTimeout &&
									clearTimeout(this.experience.world.powerUps.slowDownTimeout);
								this.experience.world.powerUps.invincibleTimeout &&
									clearTimeout(
										this.experience.world.powerUps.invincibleTimeout,
									);
								this.experience.hud.updateLives();
								if (this.experience.lives !== 0) {
									this.experience.world.player.respawnAnimation();
								}
							}
						}
					}
				}
			} else {
				this.experience.gameEnded = true;
				if (this.experience.soundEnabled) {
					this.experience.audioManager.playAudio(
						this.resources.items.deathSound,
					);
				}
				this.experience.world.player.dieAnimation();
			}
		}
	}
}
