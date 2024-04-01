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
		this.tweensOfMovement = [];
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
				child.material.envMap = this.halloweenBitsTexture;
				child.material.side = THREE.DoubleSide;
				child.material.map = this.playerColorTexture;
				child.material.roughnessMap = this.playerRoughnessTexture;
				child.material.metalness = 0;
				child.material.roughness = 0;
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
		});
	}

	moveCharacter(movementDirection, rotation) {
		switch (movementDirection) {
			case "Right": {
				console.log("RIGHT WORKING", this.player.position.x);
				gsap.to(this.player.position, {
					x: this.player.position.x !== 8 ? this.player.position.x + 2 : 8,
					duration: 0.5,
				});
				break;
			}
			case "Left": {
				console.log("LEFT WORKING", this.player.position.x);
				gsap.to(this.player.position, {
					x: this.player.position.x !== -6 ? this.player.position.x - 2 : -6,
					duration: 0.5,
				});
				break;
			}
			case "Up": {
				console.log("UP WORKING", this.player.position.x);
				gsap.to(this.player.position, {
					z: this.player.position.z !== -8 ? this.player.position.z - 2 : -8,
					duration: 0.5,
				});
				break;
			}
			case "Down": {
				console.log("DOWN WORKING", this.player.position.x);
				gsap.to(this.player.position, {
					z: this.player.position.z !== 6 ? this.player.position.z + 2 : 6,
					duration: 0.5,
				});
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
				y: 3,
				duration: 0.25,
				ease: "power2.out",
			})
			.to(this.player.position, {
				y: 0.6,
				duration: 0.25,
				ease: "power2.in",
			});
	}

	jumpingScaleAnimation() {
		const scalingTimeline = gsap.timeline();
		scalingTimeline
			.to(this.player.scale, {
				x: this.player.scale.x - 0.2,
				y: this.player.scale.y + 0.2,
				z: this.player.scale.z - 0.2,
				duration: 0.25,
			})
			.to(this.player.scale, {
				x: this.player.scale.x + 0.2,
				y: this.player.scale.y - 0.2,
				z: this.player.scale.z + 0.2,
				duration: 0.25,
			});
	}
}
