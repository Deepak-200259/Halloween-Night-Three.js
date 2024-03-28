import Experience from "../Experience";
import * as THREE from "three";
import gsap from "gsap";
import { Folders } from "../Utils/Debug";
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
		// this.playerLight = new THREE.PointLight(0xffff00, 5);
		// this.playerLight.position.set(0, 0.2, 0);
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
		// this.player.add(this.playerLight);
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
			// this.debugFolder
			// 	.add(this.playerLight.position, "x")
			// 	.min(-6)
			// 	.max(8)
			// 	.step(0.1)
			// 	.name("Player Light X Position");
			// this.debugFolder
			// 	.add(this.playerLight.position, "y")
			// 	.min(-2)
			// 	.max(2)
			// 	.step(0.1)
			// 	.name("Player Light Y Position");
			// this.debugFolder
			// 	.add(this.playerLight.position, "z")
			// 	.min(-8)
			// 	.max(6)
			// 	.step(0.1)
			// 	.name("Player Light Z Position");
			// this.debugFolder
			// 	.add(this.playerLight, "intensity")
			// 	.min(0)
			// 	.max(10)
			// 	.step(0.1)
			// 	.name("Player Light Intensity");
		}
	}
}
