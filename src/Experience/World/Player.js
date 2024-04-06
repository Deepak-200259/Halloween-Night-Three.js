import Experience from "../Experience";
import * as THREE from "three";
import gsap from "gsap";
import { Folders } from "../Utils/Debug";
import { KEYS } from "./Constants";
export default class Player {
	constructor() {
		this.experience = new Experience();
		this.resources = this.experience.resources;
		this.scene = this.experience.scene;
		this.debug = this.experience.debug;
		if (this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder(Folders.playerSettings);
		}
		this.addPlayer();
		this.startPlayerAnim();
		this.registerEvents();
		this.isAnimationPlaying = false;
		this.occupiedPositions = this.experience.world.graves.gravesCoordinates;
	}

	startPlayerAnim() {
		if (this.player) {
			gsap
				.to(this.player.position, { duration: 1.4, y: 0.6 })
				.then(() => this.playerBreatheAnim(this.player));
		}
	}

	playerBreatheAnim(player) {
		gsap
			.timeline()
			.to(player.scale, { duration: 0.5, y: 0.75, x: 1.15, z: 1.15 })
			.to(player.scale, { duration: 0.5, y: 1, x: 1, z: 1 })
			.delay(1)
			.repeat(Infinity);
	}

	checkIfPositionIsAvailable(playerNextPosition) {
		for (let i = 0; i < this.occupiedPositions.length; i++) {
			if (
				playerNextPosition.x === this.occupiedPositions[i].x &&
				playerNextPosition.z === this.occupiedPositions[i].z
			) {
				return true;
			}
		}
		return false;
	}

	addPlayer() {
		this.halloweenBitsTexture = this.resources.items.halloweenBitsTexture;
		this.playerColorTexture = this.resources.items.pumpkin002_basecolor;
		this.playerRoughnessTexture = this.resources.items.pumpkin002_roughness;
		this.halloweenBitsTexture.colorSpace = THREE.SRGBColorSpace;
		this.playerColorTexture.colorSpace = THREE.SRGBColorSpace;
		this.halloweenBitsTexture.flipY = false;
		this.playerColorTexture.flipY = false;
		this.playerRoughnessTexture.flipY = false;
		this.player = this.resources.items.playerPumpkin.scene.clone();
		this.scene.add(this.player);
		this.player.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.material = new THREE.MeshPhongMaterial();
				child.material.side = THREE.DoubleSide;
				child.material.map = this.playerColorTexture;
				child.material.map.flipY = false;
				child.material.roughnessMap = this.playerRoughnessTexture;
				child.castShadow = true;
			}
		});
		this.player.position.set(0, 4, 0);
		if (this.debug.active) {
			this.debugFolder
				.add(this.player.position, "x")
				.min(-6)
				.max(8)
				.step(0.1)
				.name("Player X Position");
			this.debugFolder
				.add(this.player.position, "y")
				.min(-2)
				.max(2)
				.step(0.1)
				.name("Player Y Position");
			this.debugFolder
				.add(this.player.position, "z")
				.min(-8)
				.max(6)
				.step(0.1)
				.name("Player Z Position");
		}
	}

	registerEvents() {
		window.addEventListener("keydown", (event) => {
			let characterRotation = 0;
			if (!this.isAnimationPlaying) {
				switch (event.key) {
					case KEYS.ARROW_RIGHT:
						characterRotation = Math.PI / 2;
						this.moveCharacter("Right", characterRotation);
						break;
					case KEYS.ARROW_LEFT:
						characterRotation = -Math.PI / 2;
						this.moveCharacter("Left", characterRotation);
						break;
					case KEYS.ARROW_UP:
						characterRotation = Math.PI;
						this.moveCharacter("Up", characterRotation);
						break;
					case KEYS.ARROW_DOWN:
						characterRotation = 0;
						this.moveCharacter("Down", characterRotation);
						break;
				}
			}
		});
	}

	moveCharacter(movementDirection, rotation) {
		this.isAnimationPlaying = true;
		switch (movementDirection) {
			case "Right": {
				console.log("RIGHT WORKING", this.player.position.x);
				if (
					!this.checkIfPositionIsAvailable(
						new THREE.Vector3(
							this.player.position.x !== 8 ? this.player.position.x + 2 : 8,
							this.player.position.y,
							this.player.position.z,
						),
					)
				) {
					gsap.to(this.player.position, {
						x: this.player.position.x !== 8 ? this.player.position.x + 2 : 8,
						duration: 0.35,
						onComplete: () => {
							if (
								(this.player.position.x === -2 ||
									this.player.position.x === 0 ||
									this.player.position.x === 2 ||
									this.player.position.x === 4) &&
								this.player.position.z === 6
							) {
								this.experience.world.gateArch.hideGateArch();
							} else {
								this.experience.world.gateArch.showGateArch();
							}
						},
					});
				}
				break;
			}
			case "Left": {
				console.log("LEFT WORKING", this.player.position.x);
				if (
					!this.checkIfPositionIsAvailable(
						new THREE.Vector3(
							this.player.position.x !== -6 ? this.player.position.x - 2 : -6,
							this.player.position.y,
							this.player.position.z,
						),
					)
				) {
					gsap.to(this.player.position, {
						x: this.player.position.x !== -6 ? this.player.position.x - 2 : -6,
						duration: 0.35,
						onComplete: () => {
							if (
								(this.player.position.x === -2 ||
									this.player.position.x === 0 ||
									this.player.position.x === 2 ||
									this.player.position.x === 4) &&
								this.player.position.z === 6
							) {
								this.experience.world.gateArch.hideGateArch();
							} else {
								this.experience.world.gateArch.showGateArch();
							}
						},
					});
				}
				break;
			}
			case "Up": {
				console.log("UP WORKING", this.player.position.x);
				if (
					!this.checkIfPositionIsAvailable(
						new THREE.Vector3(
							this.player.position.x,
							this.player.position.y,
							this.player.position.z !== -8 ? this.player.position.z - 2 : -8,
						),
					)
				) {
					gsap.to(this.player.position, {
						z: this.player.position.z !== -8 ? this.player.position.z - 2 : -8,
						duration: 0.35,
						onComplete: () => {
							if (
								(this.player.position.x === -2 ||
									this.player.position.x === 0 ||
									this.player.position.x === 2 ||
									this.player.position.x === 4) &&
								this.player.position.z === 6
							) {
								this.experience.world.gateArch.hideGateArch();
							} else {
								this.experience.world.gateArch.showGateArch();
							}
						},
					});
				}
				break;
			}
			case "Down": {
				console.log("DOWN WORKING", this.player.position.x);
				if (
					!this.checkIfPositionIsAvailable(
						new THREE.Vector3(
							this.player.position.x,
							this.player.position.y,
							this.player.position.z !== 6 ? this.player.position.z + 2 : 6,
						),
					)
				) {
					gsap.to(this.player.position, {
						z: this.player.position.z !== 6 ? this.player.position.z + 2 : 6,
						duration: 0.35,
						onComplete: () => {
							if (
								(this.player.position.x === -2 ||
									this.player.position.x === 0 ||
									this.player.position.x === 2 ||
									this.player.position.x === 4) &&
								this.player.position.z === 6
							) {
								this.experience.world.gateArch.hideGateArch();
							} else {
								this.experience.world.gateArch.showGateArch();
							}
						},
					});
				}
				break;
			}
		}
		this.rotationAnimation(rotation);
		this.jumpingAnimation();
		this.jumpingScaleAnimation();
	}

	rotationAnimation(rotation) {
		gsap.to(this.player.rotation, {
			y: rotation,
			duration: 0.25,
		});
	}

	jumpingAnimation() {
		const positioningTimeling = gsap.timeline();
		positioningTimeling
			.to(this.player.position, {
				y: 2,
				duration: 0.2,
				ease: "power2.out",
			})
			.to(this.player.position, {
				y: 0.6,
				duration: 0.15,
				ease: "power2.in",
				onComplete: () => {
					this.isAnimationPlaying = false;
				},
			});
	}

	jumpingScaleAnimation() {
		const scalingTimeline = gsap.timeline();
		scalingTimeline
			.to(this.player.scale, {
				x: 0.8,
				y: 1.2,
				z: 0.8,
				duration: 0.2,
			})
			.to(this.player.scale, {
				x: 1,
				y: 1,
				z: 1,
				duration: 0.15,
			});
	}
}
