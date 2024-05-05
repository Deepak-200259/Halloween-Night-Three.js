import Experience from "../Experience";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import gsap from "gsap";
export default class TextManager {
	constructor() {
		this.experience = new Experience();
		this.scene = this.experience.scene;
		this.camera = this.experience.camera.instance;
		this.font = this.experience.resources.items.halloween_Spooky_Font;
	}

	createText = (text, position) => {
		const textGeometry = new TextGeometry(text, {
			font: this.font,
			size: 0.7,
			height: 0.3,
			fontWeight: 200,
		});
		const textMaterial = new THREE.MeshStandardMaterial({
			color: 0x000000,
			transparent: true,
		});

		const textMesh = new THREE.Mesh(textGeometry, textMaterial);
		textMesh.position.copy(position);
		textMesh.lookAt(this.camera.position);
		this.scene.add(textMesh);

		this.playAnimationOfText(textMesh);
	};

	playAnimationOfText(textMesh) {
		gsap.to(textMesh.position, {
			y: 3,
			duration: 1,
		});
		gsap
			.to(textMesh.material, {
				opacity: 0,
				duration: 1,
			})
			.then(() => {
				this.removeTextFromScene(textMesh);
			});
	}

	removeTextFromScene(obj) {
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
}
