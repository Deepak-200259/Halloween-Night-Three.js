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
			this.playInvinsibleAnimation();
			gsap.to(this.player.position, { duration: 1, y: 0.6 }).then(() => {
				this.playPlayerBreatheAnimation();
			});
		}
	}

	playPlayerBreatheAnimation() {
		gsap
			.timeline()
			.fromTo(
				this.player.scale,
				{ y: 1, x: 1, z: 1 },
				{ duration: 0.5, y: 0.75, x: 1.15, z: 1.15 },
			)
			.fromTo(
				this.player.scale,
				{ y: 0.75, x: 1.15, z: 1.15 },
				{ duration: 0.5, y: 1, x: 1, z: 1 },
			)
			.repeat(Infinity);
	}

	checkIfPositionIsAvailable(playerNextPosition) {
		for (let i = 0; i < this.occupiedPositions.length; i++) {
			if (playerNextPosition.x === 0 && playerNextPosition.z === 0) {
				return false;
			}
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
				this.playerBoundingBox = new THREE.Box3().setFromObject(child, true);
				child.material = new THREE.MeshPhongMaterial();
				child.material.side = THREE.DoubleSide;
				child.material.map = this.playerColorTexture;
				child.material.map.flipY = false;
				child.material.transparent = true;
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
					case KEYS.CAPITAL_D:
					case KEYS.SMALL_D:
						characterRotation = Math.PI / 2;
						this.moveCharacter("Right", characterRotation);
						break;
					case KEYS.ARROW_LEFT:
					case KEYS.CAPITAL_A:
					case KEYS.SMALL_A:
						characterRotation = -Math.PI / 2;
						this.moveCharacter("Left", characterRotation);
						break;
					case KEYS.ARROW_UP:
					case KEYS.CAPITAL_W:
					case KEYS.SMALL_W:
						characterRotation = Math.PI;
						this.moveCharacter("Up", characterRotation);
						break;
					case KEYS.ARROW_DOWN:
					case KEYS.CAPITAL_S:
					case KEYS.SMALL_S:
						characterRotation = 0;
						this.moveCharacter("Down", characterRotation);
						break;
				}
			}
		});
	}

	checkPositionToHideGateArch() {
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
	}

	moveCharacter(movementDirection, rotation) {
		if (!this.experience.gameEnded) {
			this.isAnimationPlaying = true;
			switch (movementDirection) {
				case "Right": {
					this.playJumpSound();
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
							onComplete: () => this.checkPositionToHideGateArch(),
						});
					}
					break;
				}
				case "Left": {
					this.playJumpSound();
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
							x:
								this.player.position.x !== -6 ? this.player.position.x - 2 : -6,
							duration: 0.35,
							onComplete: () => this.checkPositionToHideGateArch(),
						});
					}
					break;
				}
				case "Up": {
					this.playJumpSound();
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
							z:
								this.player.position.z !== -8 ? this.player.position.z - 2 : -8,
							duration: 0.35,
							onComplete: () => this.checkPositionToHideGateArch(),
						});
					}
					break;
				}
				case "Down": {
					this.playJumpSound();
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
							onComplete: () => this.checkPositionToHideGateArch(),
						});
					}
					break;
				}
			}
			this.rotationAnimation(rotation);
			this.jumpingAnimation();
			this.jumpingScaleAnimation();
		}
	}

	playJumpSound() {
		if (this.experience.soundEnabled) {
			this.experience.audioManager.playAudio(this.resources.items.jumpSound);
		}
	}

	rotationAnimation(rotation) {
		gsap.to(this.player.rotation, {
			y: rotation,
			duration: 0.25 * this.experience.playerSpeed,
		});
	}

	jumpingAnimation() {
		const positioningTimeling = gsap.timeline();
		positioningTimeling
			.to(this.player.position, {
				y: 2,
				duration: 0.2 * this.experience.playerSpeed,
				ease: "power2.out",
			})
			.to(this.player.position, {
				y: 0.6,
				duration: 0.15 * this.experience.playerSpeed,
				ease: "power2.in",
			})
			.then(() => {
				this.isAnimationPlaying = false;
			});
	}

	jumpingScaleAnimation() {
		const scalingTimeline = gsap.timeline();
		scalingTimeline
			.to(this.player.scale, {
				x: 0.8,
				y: 1.2,
				z: 0.8,
				duration: 0.2 * this.experience.playerSpeed,
			})
			.to(this.player.scale, {
				x: 1,
				y: 1,
				z: 1,
				duration: 0.15 * this.experience.playerSpeed,
			});
	}

	playInvinsibleAnimation() {
		const invisibleTimeline = gsap.timeline();
		invisibleTimeline
			.fromTo(
				this.player.children[0].material,
				{ opacity: 1 },
				{ opacity: 0.2, duration: 0.75 },
			)
			.fromTo(
				this.player.children[0].material,
				{ opacity: 0.2 },
				{ opacity: 1, duration: 0.25 },
			)
			.repeat(10)
			.then(() => {
				this.experience.isInvincible = false;
			});
	}

	respawnAnimation() {
		this.player.children[0].material.map = null;
		this.player.children[0].material.color = new THREE.Color(0xffffff);
		this.player.children[0].material.needsUpdate = true;

		const playerDieAndRespawnTimeLine = gsap.timeline();

		gsap.to(this.player.children[0].material, {
			opacity: 0,
			duration: 1,
		});
		playerDieAndRespawnTimeLine
			.to(this.player.position, {
				y: 3,
				duration: 1,
				onComplete: () => {
					this.player.visible = false;
					this.player.position.set(0, 2, 0);
					this.player.children[0].material.map = this.playerColorTexture;
					this.player.children[0].material.needsUpdate = true;
				},
				delay: 0.25,
			})
			.then(() => {
				this.player.visible = true;
				this.player.rotation.y = 0;
				this.startPlayerAnim();
			});
	}

	dieAnimation() {
		this.experience.audioManager.playAudio(this.resources.items.gameOverSound);
		gsap.killTweensOf(this.player.scale);
		const grave = this.resources.items.playerGrave.scene.clone();
		grave.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.material = new THREE.MeshPhongMaterial();
				child.material.map = this.resources.items.graveBaseColor;
				child.material.map.flipY = false;
				child.castShadow = true;
				child.material.metalness = 1;
				child.material.roughness = 1;
			}
		});
		grave.position.copy(this.player.position);
		grave.position.y = 10;
		this.scene.add(grave);
		const graveAddTimeline = gsap.timeline();
		graveAddTimeline
			.to(grave.position, { y: 0.1, duration: 0.5 })
			.to(grave.scale, { x: 1.2, y: 0.8, duration: 0.2 })
			.to(grave.scale, { x: 1, y: 1, duration: 0.2 });

		const playerDieTimeline = gsap.timeline();
		playerDieTimeline
			.to(this.player.scale, { y: 0.02, duration: 0.25 })
			.to(this.player.position, { y: 0.1, duration: 0.25 });
	}

	update() {
		if (!this.experience.gameEnded) {
			if (this.experience.world.powerUps.currentPowerup) {
				const PlayerBox = this.playerBoundingBox;
				const powerupBox =
					this.experience.world.powerUps.currentPowerupBoundingBox;
				const powerup =
					this.experience.world.powerUps.currentPowerup.children[0];

				PlayerBox.setFromObject(this.player.children[0]);
				if (powerupBox) {
					powerupBox.setFromObject(powerup);
					if (
						!this.experience.powerupActive &&
						powerupBox?.intersectsBox(PlayerBox)
					) {
						this.experience.powerupActive = true;
						this.experience.world.powerUps.powerupChoosen();
					}
				}
			}
		}
	}
}
