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
		this.ghotsCurrentlyInScene = [];
		this.boundingBoxesOfGhosts = [];

		const ghostSpawnInterval = setInterval(() => {
			if (!this.experience.gameEnded) {
				const { selectedghost, ghostPos } = this.selectGhost(ghostType);
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
		ghost.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				const ghostBoundingBox = new THREE.Box3().setFromObject(child);
				this.boundingBoxesOfGhosts.push(ghostBoundingBox);
				child.material = new THREE.MeshPhongMaterial();
				child.material.map = this.experience.resources.items.ghostBaseColor;
				child.material.map.flipY = false;
				child.material.map.colorspace = THREE.SRGBColorSpace;
				child.castShadow = true;
			}
		});
		gsap.to(ghost.children[0].material, { opacity: 1 });
		ghost.position.set(positionOfGhost.x, 0.6, positionOfGhost.z);
		this.scene.add(ghost);
		this.ghotsCurrentlyInScene.push(ghost);
		const movementObj = this.CheckDirectionToMoveGhost(positionOfGhost);
		ghost.rotation.y = this.chooseRotationAngle(ghost.position, movementObj);
		this.playWhiteGhostMovementAnimation(ghost, movementObj);
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

	playWhiteGhostMovementAnimation(ghost, movementObj) {
		gsap.fromTo(ghost.position, { y: 3 }, { y: 0.6, duration: 1 }).then(() => {
			let ghostAnimations = [];
			let totalAnimations = movementObj.directionArray.length; // To keep track of total animations completed

			movementObj.directionArray.forEach((direction, index) => {
				let animation = gsap.to(ghost.position, {
					x: movementObj.x !== undefined ? ghost.position.x : direction,
					z: movementObj.z !== undefined ? ghost.position.z : direction,
					duration: 6,
					ease: "none",
					onComplete: () => {
						// When this animation completes, decrement the totalAnimations count
						totalAnimations--;

						// If all animations are completed, play the reverse animations
						if (totalAnimations === 0) {
							reverseAllAnimations();
						}
					},
				});
				ghostAnimations.push(animation);
			});

			const reverseAllAnimations = () => {
				ghostAnimations.forEach((animation) => animation.reverse());
				gsap.to(ghost.rotation, {
					y: ghost.rotation.y + Math.PI,
					duration: 0.1,
					ease: "none",
				});
			};
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
			console.log("working");
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
				this.ghotsCurrentlyInScene[0] !== null ||
				this.ghotsCurrentlyInScene[0] !== undefined
			) {
				this.ghotsCurrentlyInScene.shift();
			}
		}
	}

	updateBoundingBox(object, box) {
		box.setFromObject(object);
		return box;
	}

	update() {
		if (!this.experience.gameEnded) {
			if (this.experience.score > 1000) {
				this.experience.round += 1;
				this.experience.hud.updateRounds();
			}
			if (this.experience.lives > 0) {
				if (this.experience.isInvincible === false) {
					const playerBox = this.updateBoundingBox(
						this.experience.world.player.player.children[0],
						this.experience.world.player.playerBoundingBox,
					);
					for (let i = 0; i < this.ghotsCurrentlyInScene.length; i++) {
						if (this.ghotsCurrentlyInScene[i]) {
							const ghostBox = this.updateBoundingBox(
								this.ghotsCurrentlyInScene[i].children[0],
								this.boundingBoxesOfGhosts[i],
							);

							if (ghostBox.intersectsBox(playerBox)) {
								this.experience.isInvincible = true;
								this.experience.world.player.dieAndBecomeInvincible();
								this.experience.lives -= 1;
								this.experience.hud.updateLives();
							}
						}
					}
				}
			} else {
				this.experience.gameEnded = true;
			}

			if (this.experience.lives === 0) {
				this.experience.gameEnded = true;
			}
		}
	}
}
